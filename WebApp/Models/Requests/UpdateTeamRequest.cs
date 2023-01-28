using System.ComponentModel.DataAnnotations;

namespace WebApp.Models.Requests;

public class UpdateTeamRequest
{
    [Required] public string Name { get; set; }
}