using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using WebApp.Data;
using WebApp.Data.Entities;

namespace WebApp.Auth;

public static class RegisterAuthExtension
{
    public static IServiceCollection RegisterAuth(this IServiceCollection services)
    {
        services.AddAuthentication().AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, o =>
        {
            o.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = 401;
                return Task.CompletedTask;
            };
            o.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = 403;
                return Task.CompletedTask;
            };
        });

        var core = services.AddIdentityCore<ApiUser>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedAccount = false;
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        });

        var builder = new IdentityBuilder(core.UserType, typeof(IdentityRole), services);
        builder.AddEntityFrameworkStores<ApplicationDbContext>().AddRoles<IdentityRole>()
            .AddSignInManager<SignInManager<ApiUser>>()
            .AddDefaultTokenProviders();

        return services;
    }
}