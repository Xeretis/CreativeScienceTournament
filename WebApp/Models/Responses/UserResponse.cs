namespace WebApp.Models.Responses;

public class UserResponse
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }

    public UserResponseTeam? Team { get; set; }

    public IEnumerable<string> Roles { get; set; }

    public bool EmailConfirmed { get; set; }
}

public class UserResponseTeam
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Points { get; set; }
    public string CreatorId { get; set; }

    public IEnumerable<UserResponseTeamUser> Members { get; set; }
}

public class UserResponseTeamUser
{
    public string Id { get; set; }
    public string UserName { get; set; }
}