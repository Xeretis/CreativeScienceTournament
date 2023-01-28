using System.ComponentModel.DataAnnotations;

namespace CreativeScienceTournament.Models.Requests;

public class UpdateUserRequest
{
    [Required] public string UserName { get; set; }
    [Required] public string Email { get; set; }

    public string? NewPassword { get; set; }
    public string? ConfirmNewPassword { get; set; }

    public string? CurrentPassword { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (NewPassword != ConfirmNewPassword)
            yield return new ValidationResult("A megadott jelszavak nem egyeznek",
                new[] { nameof(NewPassword), nameof(ConfirmNewPassword) });
    }
}