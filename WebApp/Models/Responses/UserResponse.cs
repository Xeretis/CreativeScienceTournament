namespace WebApp.Models.Responses;

public class UserResponse
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }

    public IEnumerable<string> Roles { get; set; }

    public bool EmailConfirmed { get; set; }
}