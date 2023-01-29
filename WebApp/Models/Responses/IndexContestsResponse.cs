namespace WebApp.Models.Responses;

public class IndexContestsResponse
{
    public int Id { get; set; }
    public string Topic { get; set; }
    public string Description { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string? ThumbnailUrl { get; set; }
}