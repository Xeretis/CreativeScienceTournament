using WebApp.Support.Mail;

namespace WebApp.Services.Interfaces;

public interface IMailService
{
    Task SendEmailAsync(MailData mailData);
}