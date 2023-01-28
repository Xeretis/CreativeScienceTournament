using Microsoft.AspNetCore.Identity;

namespace CreativeScienceTournament.Data.Entities;

public class ApiUser : IdentityUser
{
    public int? TeamId { get; set; }
    public Team? Team { get; set; }
}