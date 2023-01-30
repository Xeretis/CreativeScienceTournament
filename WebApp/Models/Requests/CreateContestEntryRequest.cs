using System.ComponentModel.DataAnnotations;

namespace WebApp.Models.Requests;

public class CreateContestEntryRequest
{
    [Required] public IFormFile Solution { get; set; }
}