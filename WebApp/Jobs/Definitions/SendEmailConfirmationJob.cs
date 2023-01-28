using RazorEmails.Services.Interfaces;
using RazorEmails.Views.Emails.ConfirmAccount;
using WebApp.Data.Entities;
using WebApp.Services.Interfaces;
using WebApp.Support.Mail;

namespace WebApp.Jobs.Definitions;

public class SendEmailConfirmationJob
{
    private readonly IMailService _mailService;
    private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;

    public SendEmailConfirmationJob(IRazorViewToStringRenderer razorViewToStringRenderer, IMailService mailService)
    {
        _razorViewToStringRenderer = razorViewToStringRenderer;
        _mailService = mailService;
    }

    public void Run(ApiUser user, string confirmEmailUrl)
    {
        var email = new MailData
        {
            To = user.Email!,
            Subject = "KTTV regisztráció megerősítése",
            Body = _razorViewToStringRenderer
                .RenderViewToStringAsync("/Views/Emails/ConfirmAccount/ConfirmEmailAddressEmail.cshtml",
                    new ConfirmEmailAddressViewModel { ConfirmEmailUrl = confirmEmailUrl }).GetAwaiter()
                .GetResult()
        };

        _mailService.SendEmailAsync(email).Wait();
    }
}