using EFCoreSecondLevelCacheInterceptor;
using Microsoft.EntityFrameworkCore;

namespace WebApp.Data;

public static class RegisterPersistenceExtension
{
    public static IServiceCollection RegisterPersistence(this IServiceCollection services, string? connectionString)
    {
        services.AddEFSecondLevelCache(options =>
            {
                options.UseMemoryCacheProvider().DisableLogging(true).UseCacheKeyPrefix("EF_");
                options.CacheAllQueries(CacheExpirationMode.Sliding, TimeSpan.FromMinutes(10));
            }
        );

        services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
        {
            options.UseNpgsql(connectionString)
                .AddInterceptors(serviceProvider.GetRequiredService<SecondLevelCacheInterceptor>());
        });

        return services;
    }
}