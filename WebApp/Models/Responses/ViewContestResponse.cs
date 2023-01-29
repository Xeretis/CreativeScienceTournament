namespace WebApp.Models.Responses;

public class ViewContestResponse
{
    public int Id { get; set; }
    public string Topic { get; set; }
    public string Description { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public string? ThumbnailUrl { get; set; }

    public IEnumerable<ViewContestResponseTeam> Teams { get; set; }
}

public class ViewContestResponseTeam
{
    public int Id { get; set; }

    public string Name { get; set; }
    public int Points { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}