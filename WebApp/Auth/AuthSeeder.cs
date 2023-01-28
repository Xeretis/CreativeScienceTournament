using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using WebApp.Data;
using WebApp.Data.Entities;

namespace WebApp.Auth;

public static class AuthSeeder
{
    public static async Task SeedRoles(IServiceProvider serviceProvider)
    {
        var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        foreach (var role in AuthConstants.Roles)
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
    }

    public static async Task SeedAdmin(IServiceProvider serviceProvider, ConfigurationManager configuration)
    {
        var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApiUser>>();

        var user = new ApiUser
        {
            Id = AuthConstants.AdminId,
            Email = configuration["Admin:Email"],
            UserName = "admin",
            EmailConfirmed = true
        };

        if (await dbContext.Users.FindAsync(user.Id) == null)
        {
            var password = new PasswordHasher<ApiUser>();
            var hashed = password.HashPassword(user, configuration["Admin:Password"]);

            user.PasswordHash = hashed;

            var userStore = new UserStore<ApiUser>(dbContext);
            await userStore.CreateAsync(user);

            await userManager.AddToRoleAsync(user, AuthConstants.AdminRole);
        }

        await dbContext.SaveChangesAsync();
    }
}