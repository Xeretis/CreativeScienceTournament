using Hangfire;
using Hangfire.PostgreSql;

namespace WebApp.Support.Hangfire;

public static class RegisterHangfireSupportExtension
{
    public static void RegisterHangfireSupport(this IServiceCollection services, string? connectionString)
    {
        services.AddHangfire(c =>
        {
            c.UsePostgreSqlStorage(connectionString)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170);
        });

        services.AddHangfireServer();
    }
}