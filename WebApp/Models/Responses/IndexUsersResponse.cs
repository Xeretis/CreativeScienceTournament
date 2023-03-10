namespace WebApp.Models.Responses;

public class IndexUsersResponse
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string? Email { get; set; }
    public int? TeamId { get; set; }
}