using WebApp.Services.Implementations;
using WebApp.Services.Interfaces;

namespace WebApp.Services;

public static class RegisterServicesExtension
{
    public static IServiceCollection RegisterWebAppServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddSingleton<IMailService, MailService>();
        services.AddScoped<ITeamService, TeamService>();
        services.AddScoped<IContestService, ContestService>();
        services.AddScoped<IContestEntryService, ContestEntryService>();
        return services;
    }
}