namespace WebApp.Models.Responses;

public class ViewContestResponse
{
    public int Id { get; set; }
    public string Topic { get; set; }
    public string Description { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string? ThumbnailUrl { get; set; }
}