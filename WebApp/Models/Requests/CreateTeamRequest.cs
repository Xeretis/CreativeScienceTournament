using System.ComponentModel.DataAnnotations;

namespace WebApp.Models.Requests;

public class CreateTeamRequest
{
    [Required] public string Name { get; set; }
}