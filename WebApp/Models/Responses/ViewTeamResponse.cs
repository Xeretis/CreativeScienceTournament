namespace WebApp.Models.Responses;

public class ViewTeamResponse
{
    public int Id { get; set; }

    public string Name { get; set; }
    public int Points { get; set; }
    public string OwnerId { get; set; }

    public IEnumerable<ViewTeamResponseUser> Members { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ViewTeamResponseUser
{
    public string Id { get; set; }
    public string UserName { get; set; }
}