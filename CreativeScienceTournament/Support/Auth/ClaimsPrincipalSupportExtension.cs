using System.Security.Claims;

namespace CreativeScienceTournament.Support.Auth;

public static class ClaimsPrincipalSupportExtension
{
    public static string? GetId(this ClaimsPrincipal principal)
    {
        return principal.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}