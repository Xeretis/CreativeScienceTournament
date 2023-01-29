using Microsoft.AspNetCore.Authorization;

namespace WebApp.Auth.Requirements;

public class FullTeamRequirement : IAuthorizationRequirement
{
    public FullTeamRequirement(bool isRequired)
    {
        IsRequired = isRequired;
    }

    public bool IsRequired { get; }
}