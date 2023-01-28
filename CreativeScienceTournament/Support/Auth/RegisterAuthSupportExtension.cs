using Microsoft.AspNetCore.Authorization.Policy;

namespace CreativeScienceTournament.Support.Auth;

public static class RegisterAuthSupportExtension
{
    public static void RegisterAuthSupport(this IServiceCollection services)
    {
        services.AddTransient<IPolicyEvaluator, ChallengeUnauthenticatedPolicyEvaluator>();
        services.AddTransient<PolicyEvaluator>();
    }
}