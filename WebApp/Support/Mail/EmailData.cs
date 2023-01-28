namespace WebApp.Support.Mail;

public class MailData
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
    public List<IFormFile>? Attachments { get; set; }
}