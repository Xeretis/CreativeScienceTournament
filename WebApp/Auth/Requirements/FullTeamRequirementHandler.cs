using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Support.Auth;

namespace WebApp.Auth.Requirements;

public class FullTeamRequirementHandler : AuthorizationHandler<FullTeamRequirement>
{
    private readonly ApplicationDbContext _dbContext;

    public FullTeamRequirementHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
        FullTeamRequirement requirement)
    {
        var user = await _dbContext.Users.Include(u => u.Team).ThenInclude(t => t.Members)
            .FirstOrDefaultAsync(u => u.Id == context.User.GetId());

        if (user == null || user.Team == null) return;

        if (requirement.IsRequired ? user.Team.Members.Count == 3 : user.Team.Members.Count < 3)
            context.Succeed(requirement);
    }
}