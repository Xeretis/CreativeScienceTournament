using System.ComponentModel.DataAnnotations;
using CreativeScienceTournament.Data.Entities.Owned;

namespace CreativeScienceTournament.Data.Entities;

public class Contest : BaseEntity
{
    [Key] public int Id { get; set; }
    [Required] public string Topic { get; set; }
    [Required] public string Description { get; set; }

    [Required] public Exercise Exercise { get; set; }

    [Required] public int MaxPoints { get; set; }

    [Required] public DateTime StartDate { get; set; }
    [Required] public DateTime EndDate { get; set; }

    public string? ThumbnailUrl { get; set; }

    public List<Team> Teams { get; set; }
    public List<ContestEntry> ContestEntries { get; set; }
}