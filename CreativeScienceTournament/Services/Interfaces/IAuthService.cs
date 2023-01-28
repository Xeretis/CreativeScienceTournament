using System.Security.Claims;
using CreativeScienceTournament.Data.Entities;

namespace CreativeScienceTournament.Services.Interfaces;

public interface IAuthService
{
    Task<List<Claim>> GetAuthClaimsAsync(ApiUser user);
}