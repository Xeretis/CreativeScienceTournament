using System.Security.Claims;
using CreativeScienceTournament.Auth;

namespace CreativeScienceTournament.Support.Auth;

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