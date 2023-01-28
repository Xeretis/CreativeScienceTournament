using WebApp.Services.Implementations;
using WebApp.Services.Interfaces;

namespace WebApp.Services;

public static class RegisterServicesExtension
{
    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}