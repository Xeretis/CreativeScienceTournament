using System.ComponentModel.DataAnnotations;
using WebApp.Validation;

namespace WebApp.Models.Requests;

public class CreateContestEntryRequest
{
    [MaxFileSize(8 * 1024 * 1024)]
    [AllowedMimeTypes(new[]
    {
        "application/pdf", "application/msword", "application/zip",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", "image/bmp", "image/jpeg",
        "image/x-png", "image/png", "image/gif"
    })]
    [Required]
    public IFormFile Solution { get; set; }
}