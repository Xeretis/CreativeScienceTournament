using Microsoft.Extensions.DependencyInjection;
using RazorEmails.Services.Implementations;
using RazorEmails.Services.Interfaces;

namespace RazorEmails.Services;

public static class RegisterServicesExtension
{
    public static IServiceCollection RegisterRazorEmailsServices(this IServiceCollection services)
    {
        services.AddScoped<IRazorViewToStringRenderer, RazorViewToStringRenderer>();
        return services;
    }
}