using System.ComponentModel.DataAnnotations;
using Sieve.Attributes;

namespace WebApp.Data.Entities;

public class Team : BaseEntity
{
    [Sieve(CanFilter = true, CanSort = true)]
    [Key]
    public int Id { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public string Name { get; set; }

    [Required] public string CreatorId { get; set; }

    public List<ApiUser> Members { get; set; }
    public List<Contest> Contests { get; set; }
    public List<PointEntry> PointEntries { get; set; }
    public List<ContestEntry> ContestEntries { get; set; }
}