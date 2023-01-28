using Microsoft.AspNetCore.Authorization;

namespace WebApp.Auth.Requirements;

public class EmailRequirement : IAuthorizationRequirement
{
    public EmailRequirement(bool isRequired)
    {
        IsRequired = isRequired;
    }

    public bool IsRequired { get; }
}