namespace WebApp.Models.Responses;

public class IndexTeamsResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Points { get; set; }
    public string CreatorId { get; set; }

    public IEnumerable<IndexTeamResponseUser> Members { get; set; }
}

public class IndexTeamResponseUser
{
    public string Id { get; set; }
    public string UserName { get; set; }
}