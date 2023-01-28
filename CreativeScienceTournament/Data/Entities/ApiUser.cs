using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity;

namespace CreativeScienceTournament.Data.Entities;

public class ApiUser : IdentityUser, IUser<string>
{
    public int? TeamId { get; set; }
    public Team? Team { get; set; }
}