using WebApp.Services.Implementations;
using WebApp.Services.Interfaces;

namespace WebApp.Services;

public static class RegisterServicesExtension
{
    public static IServiceCollection RegisterWebAppServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddSingleton<IMailService, MailService>();
        return services;
    }
}