using Sieve.Services;

namespace CreativeScienceTournament.Support.Sorting;

public static class RegisterSortingSupportExtension
{
    public static void RegisterSortingSupport(this IServiceCollection services)
    {
        services.AddScoped<ISieveCustomSortMethods, CustomSieveSortMethods>();
    }
}