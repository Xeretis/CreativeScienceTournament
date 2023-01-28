using System.ComponentModel.DataAnnotations;

namespace CreativeScienceTournament.Data.Entities;

public class PointEntry : BaseEntity
{
    [Key] public int Id { get; set; }

    [Required] public int Amount { get; set; }
    [Required] public string Reason { get; set; }

    [Required] public int TeamId { get; set; }
    public Team Team { get; set; }
}