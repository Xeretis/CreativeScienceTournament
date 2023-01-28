using System.ComponentModel.DataAnnotations;

namespace CreativeScienceTournament.Models.Requests;

public class UpdateTeamRequest
{
    [Required] public string Name { get; set; }
}