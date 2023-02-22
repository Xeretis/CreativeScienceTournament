using System.ComponentModel.DataAnnotations;
using Sieve.Attributes;
using WebApp.Data.Entities.Owned;

namespace WebApp.Data.Entities;

public class Contest : BaseEntity
{
    [Sieve(CanFilter = true, CanSort = true)]
    [Key]
    public int Id { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public string Topic { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public string Description { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public bool Concluded { get; set; }

    [Required] public Exercise Exercise { get; set; }
    public TopicHelp? TopicHelp { get; set; }

    [Required] public int MaxPoints { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public DateTime StartDate { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public DateTime EndDate { get; set; }

    public string? ThumbnailUrl { get; set; }

    public List<Team> Teams { get; set; }
    public List<ContestEntry> ContestEntries { get; set; }
}