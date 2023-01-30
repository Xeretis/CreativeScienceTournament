namespace WebApp.Filters;

public static class RegisterFiltersExtension
{
    public static IServiceCollection RegisterFilters(this IServiceCollection services)
    {
        services.AddScoped<RequireFullTeamActionFilter>();
        return services;
    }
}