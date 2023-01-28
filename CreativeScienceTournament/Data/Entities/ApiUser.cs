using Microsoft.AspNetCore.Identity;
using Sieve.Attributes;

namespace CreativeScienceTournament.Data.Entities;

public class ApiUser : IdentityUser
{
    [Sieve(CanFilter = true, CanSort = true)]
    public int? TeamId { get; set; }

    public Team? Team { get; set; }
}