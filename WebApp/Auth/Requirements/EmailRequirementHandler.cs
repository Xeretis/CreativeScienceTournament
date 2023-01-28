using Microsoft.AspNetCore.Authorization;
using WebApp.Data;
using WebApp.Support.Auth;

namespace WebApp.Auth.Requirements;

public class EmailRequirementHandler : AuthorizationHandler<EmailRequirement>
{
    private readonly ApplicationDbContext _dbContext;

    public EmailRequirementHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        EmailRequirement requirement)
    {
        var user = await _dbContext.Users.FindAsync(context.User.GetId());

        if (user == null) return;

        if (user.EmailConfirmed == requirement.IsRequired) context.Succeed(requirement);
    }
}