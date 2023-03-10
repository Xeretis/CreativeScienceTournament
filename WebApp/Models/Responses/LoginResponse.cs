namespace WebApp.Models.Responses;

public class LoginResponse
{
    public LoginResponseUser User { get; set; }
}

public class LoginResponseUser
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public IEnumerable<string> Roles { get; set; }
}