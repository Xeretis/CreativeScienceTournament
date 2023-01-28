using System.ComponentModel.DataAnnotations;

namespace CreativeScienceTournament.Models.Requests;

public class CreateUserRequest
{
    [Required] public string Email { get; set; }
    [Required] public string UserName { get; set; }
    [Required] public string Password { get; set; }
    [Required] public string ConfirmPassword { get; set; }


    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Password != ConfirmPassword)
            yield return new ValidationResult("A megadott jelszavak nem egyeznek",
                new[] { nameof(Password), nameof(ConfirmPassword) });
    }
}