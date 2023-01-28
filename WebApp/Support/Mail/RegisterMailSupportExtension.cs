namespace WebApp.Support.Mail;

public static class RegisterMailSupportExtension
{
    public static void RegisterMailSupport(this IServiceCollection services, ConfigurationManager configurationManager)
    {
        services.Configure<MailConfiguration>(configurationManager.GetSection("MailSettings"));
    }
}