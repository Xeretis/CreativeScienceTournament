using Sieve.Services;

namespace WebApp.Support.Sorting;

public static class RegisterSortingSupportExtension
{
    public static void RegisterSortingSupport(this IServiceCollection services)
    {
        services.AddScoped<ISieveCustomSortMethods, CustomSieveSortMethods>();
        services.AddScoped<ISieveProcessor, CustomSieveProcessor>();
    }
}