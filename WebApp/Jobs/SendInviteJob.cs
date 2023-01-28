using RazorEmails.Services.Interfaces;
using RazorEmails.Views.Emails.TeamInvite;
using WebApp.Services.Interfaces;
using WebApp.Support.Mail;

namespace WebApp.Jobs;

public class SendInviteJob
{
    private readonly IMailService _mailService;
    private readonly IRazorViewToStringRenderer _razorViewToStringRenderer;

    public SendInviteJob(IRazorViewToStringRenderer razorViewToStringRenderer, IMailService mailService)
    {
        _razorViewToStringRenderer = razorViewToStringRenderer;
        _mailService = mailService;
    }

    public void Run(string to, string inviteUrl, string teamName, string inviterName)
    {
        var mailData = new MailData
        {
            To = to,
            Subject = "KTTV csapat meghívó",
            Body = _razorViewToStringRenderer
                .RenderViewToStringAsync("/Views/Emails/TeamInvite/TeamInviteEmail.cshtml",
                    new TeamInviteEmailViewModel
                        { InviteUrl = inviteUrl, TeamName = teamName, InviterName = inviterName }).GetAwaiter()
                .GetResult()
        };

        _mailService.SendEmailAsync(mailData).Wait();
    }
}