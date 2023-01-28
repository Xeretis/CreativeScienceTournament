using WebApp.Data.Entities;

namespace WebApp.Services.Interfaces;

public interface ITeamService
{
    public string CreateInviteToken(int teamId, string userId);
    public (int, string)? ReadInviteToken(string token);

    void SendInviteEmail(Team team, ApiUser user, string inviteUrl, string inviterName);
}