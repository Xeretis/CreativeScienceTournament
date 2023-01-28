using System.ComponentModel.DataAnnotations;
using WebApp.Data.Entities.Owned;

namespace WebApp.Data.Entities;

public class ContestEntry : BaseEntity
{
    [Key] public int Id { get; set; }

    [Required] public Solution Solution { get; set; }
    public Correction? Correction { get; set; }

    [Required] public int TeamId { get; set; }
    public Team Team { get; set; }

    [Required] public int ContestId { get; set; }
    public Contest Contest { get; set; }
}