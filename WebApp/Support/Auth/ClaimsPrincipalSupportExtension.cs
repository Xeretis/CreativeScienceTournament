using System.Security.Claims;
using WebApp.Auth;

namespace WebApp.Support.Auth;

public static class ClaimsPrincipalSupportExtension
{
    public static string? GetId(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    public static bool IsAdmin(this ClaimsPrincipal principal)
    {
        return principal.IsInRole(AuthConstants.AdminRole);
    }
}