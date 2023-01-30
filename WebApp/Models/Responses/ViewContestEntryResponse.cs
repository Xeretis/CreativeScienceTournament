namespace WebApp.Models.Responses;

public class ViewContestEntryResponse
{
    public int Id { get; set; }

    public ViewContestEntryResponseCorrection? Correction { get; set; }

    public ViewContestEntryResponseTeam Team { get; set; }
}

public class ViewContestEntryResponseCorrection
{
    public int Points { get; set; }
    public string Comment { get; set; }
}

public class ViewContestEntryResponseTeam
{
    public int Id { get; set; }
    public string Name { get; set; }
}