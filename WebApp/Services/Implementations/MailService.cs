using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using WebApp.Services.Interfaces;
using WebApp.Support.Mail;

namespace WebApp.Services.Implementations;

public class MailService : IMailService
{
    private readonly MailConfiguration _mailConfiguration;

    public MailService(IOptions<MailConfiguration> mailConfiguration)
    {
        _mailConfiguration = mailConfiguration.Value;
    }

    public async Task SendEmailAsync(MailData mailData)
    {
        var email = new MimeMessage();
        email.Sender = MailboxAddress.Parse(_mailConfiguration.Mail);
        email.To.Add(MailboxAddress.Parse(mailData.To));
        email.Subject = mailData.Subject;
        var builder = new BodyBuilder();
        if (mailData.Attachments != null)
            foreach (var file in mailData.Attachments.Where(file => file.Length > 0))
            {
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }

                builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
            }

        builder.HtmlBody = mailData.Body;
        email.Body = builder.ToMessageBody();
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_mailConfiguration.Host, _mailConfiguration.Port, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_mailConfiguration.Mail, _mailConfiguration.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}