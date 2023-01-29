using System.ComponentModel.DataAnnotations;

namespace WebApp.Validation;

public class MaxFileSizeAttribute : ValidationAttribute
{
    private readonly int _maxFileSize;

    public MaxFileSizeAttribute(int maxFileSize)
    {
        _maxFileSize = maxFileSize;
    }

    protected override ValidationResult IsValid(
        object? value, ValidationContext validationContext)
    {
        switch (value)
        {
            case IFormFile file when file.Length > _maxFileSize:
                return new ValidationResult(GetErrorMessage());
            case IEnumerable<IFormFile> files:
            {
                foreach (var f in files)
                    if (f.Length > _maxFileSize)
                        return new ValidationResult(GetErrorMessage());
                break;
            }
        }

        return ValidationResult.Success;
    }

    public string GetErrorMessage()
    {
        return $"A maximum megengedett fájl mért {_maxFileSize} byte";
    }
}