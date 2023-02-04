using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using WebApp.Data;
using WebApp.Data.Entities;
using WebApp.Models.Requests;
using WebApp.Models.Responses;
using WebApp.Services.Interfaces;
using WebApp.Support.Auth;

namespace WebApp.Controllers;

[ApiController]
[Route("Api/[controller]")]
[Produces("application/json")]
public class UsersController : Controller
{
    private readonly IAuthService _authService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly ISieveProcessor _sieveProcessor;
    private readonly UserManager<ApiUser> _userManager;

    public UsersController(ApplicationDbContext dbContext, IMapper mapper, ISieveProcessor sieveProcessor,
        UserManager<ApiUser> userManager, IAuthService authService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _sieveProcessor = sieveProcessor;
        _userManager = userManager;
        _authService = authService;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<IndexUsersResponse>>> IndexUsers([FromQuery] SieveModel sieveModel)
    {
        var users = _dbContext.Users.Where(u => u.EmailConfirmed).AsNoTracking();
        var filteredUsers = await _sieveProcessor.Apply(sieveModel, users).ToListAsync();

        var response = _mapper.Map<IEnumerable<IndexUsersResponse>>(filteredUsers);

        return Ok(response);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ViewUserResponse>> ViewUser(string id)
    {
        var user = await _dbContext.Users.Where(u => u.EmailConfirmed).FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var response = _mapper.Map<ViewUserResponse>(user);

        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ViewUserResponse>> CreateUser([FromQuery] string confirmUrl,
        CreateUserRequest request)
    {
        var user = _mapper.Map<ApiUser>(request);

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                switch (error.Code)
                {
                    case "DuplicateUserName":
                        ModelState.AddModelError(nameof(request.UserName), "Ez a felhasználónév már foglalt");
                        break;
                    case "DuplicateEmail":
                        ModelState.AddModelError(nameof(request.Email), "Ez az e-mail már foglalt");
                        break;
                    case "PasswordTooShort":
                        ModelState.AddModelError(nameof(request.Password), error.Description);
                        break;
                    default:
                        ModelState.AddModelError(nameof(request.UserName), error.Description);
                        break;
                }

            return ValidationProblem();
        }

        await _authService.SendConfirmationEmailAsync(user, confirmUrl);

        var response = _mapper.Map<ViewUserResponse>(user);

        return CreatedAtAction(nameof(ViewUser), new { id = user.Id }, response);
    }

    [Authorize]
    [HttpPatch("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateUser([FromRoute] string id, UpdateUserRequest request)
    {
        var user = await _dbContext.Users.FindAsync(id);

        if (user == null) return NotFound();

        if (user.Id != User.GetId() && !User.IsAdmin())
            return Forbid();

        if (!User.IsAdmin())
        {
            if (string.IsNullOrEmpty(request.CurrentPassword))
            {
                ModelState.AddModelError(nameof(request.CurrentPassword), "A jelenelegi jelszó megadása kötelező");
                return ValidationProblem();
            }

            if (!await _userManager.CheckPasswordAsync(user, request.CurrentPassword))
            {
                ModelState.AddModelError(nameof(request.CurrentPassword), "Helytelen jelszó");
                return ValidationProblem();
            }
        }

        _mapper.Map(request, user);

        if (!string.IsNullOrEmpty(request.Email)) user.Email = request.Email;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                switch (error.Code)
                {
                    case "DuplicateUserName":
                        ModelState.AddModelError(nameof(request.UserName), "Ez a felhasználónév már foglalt");
                        break;
                    case "DuplicateEmail":
                        ModelState.AddModelError(nameof(request.Email), "Ez az e-mail már foglalt");
                        break;
                    case "PasswordTooShort":
                        ModelState.AddModelError(nameof(request.NewPassword), error.Description);
                        break;
                    default:
                        ModelState.AddModelError(nameof(request.UserName), error.Description);
                        break;
                }

            return ValidationProblem();
        }

        if (!string.IsNullOrEmpty(request.NewPassword))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetResult = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

            if (!resetResult.Succeeded)
            {
                foreach (var error in resetResult.Errors)
                    ModelState.AddModelError(nameof(request.NewPassword), error.Description);

                return ValidationProblem();
            }
        }

        return NoContent();
    }
}