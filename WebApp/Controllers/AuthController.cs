using System.Net;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Data.Entities;
using WebApp.Models.Requests;
using WebApp.Models.Responses;
using WebApp.Services.Interfaces;
using WebApp.Support.Auth;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace WebApp.Controllers;

[ApiController]
[Route("Api/[controller]")]
[Produces("application/json")]
public class AuthController : Controller
{
    private readonly IAuthService _authService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly SignInManager<ApiUser> _signInManager;
    private readonly UserManager<ApiUser> _userManager;

    public AuthController(IAuthService authService, IMapper mapper, SignInManager<ApiUser> signInManager,
        UserManager<ApiUser> userManager, ApplicationDbContext dbContext)
    {
        _authService = authService;
        _mapper = mapper;
        _signInManager = signInManager;
        _userManager = userManager;
        _dbContext = dbContext;
    }

    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            ModelState.AddModelError(nameof(LoginRequest.Email), "Email or password is invalid");
            return ValidationProblem();
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password,
            await _userManager.GetLockoutEnabledAsync(user));

        if (result == SignInResult.Failed)
        {
            ModelState.AddModelError(nameof(LoginRequest.Email), "Email or password is invalid");
            return ValidationProblem();
        }


        var authClaims = await _authService.GetAuthClaimsAsync(user);
        var identity = new ClaimsIdentity(authClaims, CookieAuthenticationDefaults.AuthenticationScheme);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            new AuthenticationProperties
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(2)
            });

        var userResponse = _mapper.Map<LoginResponseUser>(user);
        userResponse.Roles = authClaims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

        return Ok(new LoginResponse
        {
            User = userResponse
        });
    }

    [HttpPost("ConfirmEmail")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) return NotFound();

        var result = await _userManager.ConfirmEmailAsync(user, WebUtility.UrlDecode(token));

        if (!result.Succeeded)
        {
            ModelState.AddModelError(nameof(token), "Hibás token");
            return ValidationProblem();
        }

        return NoContent();
    }

    [Authorize("EmailUnconfirmed")]
    [HttpPost("ResendEmailConfirmation")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> ResendEmailConfirmation([FromQuery] string confirmUrl)
    {
        var user = await _userManager.FindByIdAsync(User.GetId());

        await _authService.SendConfirmationEmailAsync(user, confirmUrl);

        return NoContent();
    }

    [Authorize("EmailAny")]
    [HttpGet("User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserResponse>> GetUser()
    {
        var user = await _dbContext.Users.Include(u => u.Team).ThenInclude(t => t.PointEntries)
            .FirstOrDefaultAsync(u => u.Id == User.GetId());

        var response = _mapper.Map<UserResponse>(user);
        response.Roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

        return Ok(response);
    }

    [Authorize("EmailAny")]
    [HttpDelete("Logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }
}