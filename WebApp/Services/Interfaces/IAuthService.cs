using System.Security.Claims;
using WebApp.Data.Entities;

namespace WebApp.Services.Interfaces;

public interface IAuthService
{
    Task<List<Claim>> GetAuthClaimsAsync(ApiUser user);
    Task SendConfirmationEmail(ApiUser user, string confirmUrl);
}