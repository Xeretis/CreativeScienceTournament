using Sieve.Services;

namespace WebApp.Support.Sieve;

public static class RegisterSieveSupportExtension
{
    public static void RegisterSieveSupport(this IServiceCollection services)
    {
        services.AddScoped<ISieveCustomSortMethods, CustomSieveSortMethods>();
        services.AddScoped<ISieveCustomFilterMethods, CustomSieveFilterMethods>();
        services.AddScoped<ISieveProcessor, CustomSieveProcessor>();
    }
}