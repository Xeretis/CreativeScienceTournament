using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using WebApp.Data.Entities;
using WebApp.Services.Interfaces;

namespace WebApp.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<ApiUser> _userManager;

    public AuthService(UserManager<ApiUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<Claim>> GetAuthClaimsAsync(ApiUser user)
    {
        var authClaims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.NameIdentifier, user.Id)
        };

        var userRoles = await _userManager.GetRolesAsync(user);

        authClaims.AddRange(userRoles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

        return authClaims;
    }
}