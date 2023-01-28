namespace CreativeScienceTournament.Models.Responses;

public class IndexTeamResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Points { get; set; }

    public IEnumerable<IndexTeamResponseUser> Members { get; set; }
}

public class IndexTeamResponseUser
{
    public string Id { get; set; }
    public string UserName { get; set; }
}