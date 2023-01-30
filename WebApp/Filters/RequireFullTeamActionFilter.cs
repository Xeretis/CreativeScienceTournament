using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Support.Auth;

namespace WebApp.Filters;

public class RequireFullTeamActionFilter : IAsyncActionFilter
{
    private readonly ApplicationDbContext _dbContext;

    public RequireFullTeamActionFilter(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var user = await _dbContext.Users.Include(u => u.Team).ThenInclude(t => t.Members)
            .FirstOrDefaultAsync(u => u.Id == context.HttpContext.User.GetId());

        if (user == null) return;

        if (user.Team == null)
        {
            context.Result = new BadRequestObjectResult(new { Message = "Nincs csapatod" });
            return;
        }

        if (user.Team.Members.Count != 3)
            context.Result = new BadRequestObjectResult(new { Message = "A csapatodban nincs 3 fő" });

        await next();
    }
}