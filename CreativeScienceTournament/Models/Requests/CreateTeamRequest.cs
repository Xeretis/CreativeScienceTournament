using System.ComponentModel.DataAnnotations;

namespace CreativeScienceTournament.Models.Requests;

public class CreateTeamRequest
{
    [Required] public string Name { get; set; }
}