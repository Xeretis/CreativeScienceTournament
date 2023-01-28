using System.Net;
using System.Security.Claims;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using WebApp.Data.Entities;
using WebApp.Jobs;
using WebApp.Services.Interfaces;

namespace WebApp.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly UserManager<ApiUser> _userManager;

    public AuthService(UserManager<ApiUser> userManager, IBackgroundJobClient backgroundJobClient)
    {
        _userManager = userManager;
        _backgroundJobClient = backgroundJobClient;
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

    public async Task SendConfirmationEmailAsync(ApiUser user, string confirmUrl)
    {
        var confirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var completeConfirmUrl = $"{confirmUrl}?userId={user.Id}&token={WebUtility.UrlEncode(confirmationToken)}";
        _backgroundJobClient.Enqueue<SendEmailConfirmationJob>(j => j.Run(user, completeConfirmUrl));
    }
}