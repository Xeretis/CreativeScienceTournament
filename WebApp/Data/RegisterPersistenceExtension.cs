using Microsoft.EntityFrameworkCore;

namespace WebApp.Data;

public static class RegisterPersistenceExtension
{
    public static IServiceCollection RegisterPersistence(this IServiceCollection services, string? connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }
}