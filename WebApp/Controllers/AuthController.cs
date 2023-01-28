using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    private readonly IMapper _mapper;
    private readonly SignInManager<ApiUser> _signInManager;
    private readonly UserManager<ApiUser> _userManager;

    public AuthController(IAuthService authService, IMapper mapper, SignInManager<ApiUser> signInManager,
        UserManager<ApiUser> userManager)
    {
        _authService = authService;
        _mapper = mapper;
        _signInManager = signInManager;
        _userManager = userManager;
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

    [Authorize]
    [HttpGet("User")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserResponse>> GetUser()
    {
        var user = await _userManager.FindByIdAsync(User.GetId()!);
        return Ok(_mapper.Map<UserResponse>(user));
    }

    [Authorize]
    [HttpGet("Roles")]
    public ActionResult<IEnumerable<string>> GetRoles()
    {
        var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
        return Ok(roles);
    }

    [Authorize]
    [HttpDelete("Logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }
}