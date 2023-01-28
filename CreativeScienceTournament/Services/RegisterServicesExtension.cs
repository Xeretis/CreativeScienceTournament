using CreativeScienceTournament.Services.Implementations;
using CreativeScienceTournament.Services.Interfaces;

namespace CreativeScienceTournament.Services;

public static class RegisterServicesExtension
{
    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}