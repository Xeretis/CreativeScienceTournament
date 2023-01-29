using System.Net;
using System.Text;
using Hangfire;
using Microsoft.AspNetCore.DataProtection;
using WebApp.Data.Entities;
using WebApp.Jobs;
using WebApp.Services.Interfaces;

namespace WebApp.Services.Implementations;

public class TeamService : ITeamService
{
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly ILogger<TeamService> _logger;

    public TeamService(IDataProtectionProvider dataProtectionProvider, ILogger<TeamService> logger,
        IBackgroundJobClient backgroundJobClient)
    {
        Protector = dataProtectionProvider.CreateProtector("TeamService");
        _logger = logger;
        _backgroundJobClient = backgroundJobClient;
    }

    private IDataProtector Protector { get; }

    public string CreateInviteToken(InviteTokenContent content)
    {
        var ms = new MemoryStream();
        using (var writer = new BinaryWriter(ms, new UTF8Encoding(false, true), true))
        {
            writer.Write(content.TeamId);
            writer.Write(content.UserId);
        }

        var protectedBytes = Protector.Protect(ms.ToArray());
        return Convert.ToBase64String(protectedBytes);
    }

    public InviteTokenContent? ReadInviteToken(string token)
    {
        try
        {
            var unprotectedData = Protector.Unprotect(Convert.FromBase64String(token));
            var ms = new MemoryStream(unprotectedData);
            using (var reader = new BinaryReader(ms, new UTF8Encoding(false, true), true))
            {
                while (reader.BaseStream.Position != reader.BaseStream.Length)
                {
                    var teamId = reader.ReadInt32();
                    var userId = reader.ReadString();
                    return new InviteTokenContent { TeamId = teamId, UserId = userId };
                }
            }
        }
        // ReSharper disable once EmptyGeneralCatchClause
        catch
        {
            _logger.LogDebug("Failed to read invite token");
        }

        return null;
    }

    public void SendInviteEmail(Team team, ApiUser user, string inviteUrl, string inviterName)
    {
        var token = CreateInviteToken(new InviteTokenContent { TeamId = team.Id, UserId = user.Id });
        var completeInviteUrl = $"{inviteUrl}?token={WebUtility.UrlEncode(token)}";
        _backgroundJobClient.Enqueue<SendInviteJob>(j => j.Run(user.Email, completeInviteUrl, team.Name, inviterName));
    }
}