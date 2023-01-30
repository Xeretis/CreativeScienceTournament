namespace WebApp.Models.Responses;

public class IndexContestEntriesResponse
{
    public int Id { get; set; }

    public IndexContestEntriesResponseCorrection? Correction { get; set; }

    public IndexContestEntriesResponseTeam Team { get; set; }
}

public class IndexContestEntriesResponseCorrection
{
    public int Points { get; set; }
    public string Comment { get; set; }
}

public class IndexContestEntriesResponseTeam
{
    public int Id { get; set; }
    public string Name { get; set; }
}