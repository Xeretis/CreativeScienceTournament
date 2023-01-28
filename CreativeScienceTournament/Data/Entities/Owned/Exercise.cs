using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CreativeScienceTournament.Data.Entities.Owned;

[Owned]
public class Exercise
{
    [Required] public string Filename { get; set; }
    [Required] public string OriginalFilename { get; set; }
    [Required] public string ContentType { get; set; }
}