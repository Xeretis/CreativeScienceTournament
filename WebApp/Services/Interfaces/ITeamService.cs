using WebApp.Data.Entities;

namespace WebApp.Services.Interfaces;

public interface ITeamService
{
    public string CreateInviteToken(InviteTokenContent content);
    public InviteTokenContent? ReadInviteToken(string token);

    void SendInviteEmail(Team team, ApiUser user, string inviteUrl, string inviterName);
}

public class InviteTokenContent
{
    public int TeamId { get; set; }
    public string UserId { get; set; }
}