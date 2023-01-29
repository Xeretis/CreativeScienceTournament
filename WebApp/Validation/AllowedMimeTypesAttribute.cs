using System.ComponentModel.DataAnnotations;

namespace WebApp.Validation;

public class AllowedMimeTypesAttribute : ValidationAttribute
{
    private readonly string[] _mimeTypes;

    public AllowedMimeTypesAttribute(string[] mimeTypes)
    {
        _mimeTypes = mimeTypes;
    }

    protected override ValidationResult IsValid(
        object? value, ValidationContext validationContext)
    {
        switch (value)
        {
            case IFormFile file:
            {
                var mimeType = file.ContentType;
                if (!_mimeTypes.Contains(mimeType)) return new ValidationResult(GetErrorMessage());
                break;
            }
            case IEnumerable<IFormFile> files:
            {
                foreach (var f in files)
                {
                    var mimeType = f.ContentType;
                    if (!_mimeTypes.Contains(mimeType)) return new ValidationResult(GetErrorMessage());
                }

                break;
            }
        }

        return ValidationResult.Success;
    }

    public string GetErrorMessage()
    {
        return "Ez a fájltípus nem engedélyezett";
    }
}