using System.ComponentModel.DataAnnotations;

namespace CreativeScienceTournament.Data.Entities;

public class Team : BaseEntity
{
    [Key] public int Id { get; set; }
    [Required] public string Name { get; set; }

    public List<ApiUser> Members { get; set; }
    public List<Contest> Contests { get; set; }
    public List<PointEntry> PointEntries { get; set; }
    public List<ContestEntry> ContestEntries { get; set; }
}