using System.ComponentModel.DataAnnotations;
using Sieve.Attributes;
using WebApp.Data.Entities.Owned;

namespace WebApp.Data.Entities;

public class ContestEntry : BaseEntity
{
    [Sieve(CanFilter = true, CanSort = true)]
    [Key]
    public int Id { get; set; }

    [Required] public Solution Solution { get; set; }
    public Correction? Correction { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public int TeamId { get; set; }

    public Team Team { get; set; }

    [Sieve(CanFilter = true, CanSort = true)]
    [Required]
    public int ContestId { get; set; }

    public Contest Contest { get; set; }
}