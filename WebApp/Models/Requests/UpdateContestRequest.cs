using System.ComponentModel.DataAnnotations;
using WebApp.Validation;

namespace WebApp.Models.Requests;

public class UpdateContestRequest
{
    [Required] public string Topic { get; set; }
    [Required] public string Description { get; set; }
    [Required] public int MaxPoints { get; set; }

    [AllowedMimeTypes(new[]
    {
        "application/pdf", "application/msword", "application/zip",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    })]
    public IFormFile? Exercise { get; set; }

    public IFormFile? TopicHelp { get; set; }

    [MaxFileSize(4 * 1024 * 1024)]
    [AllowedMimeTypes(new[] { "image/bmp", "image/jpeg", "image/x-png", "image/png", "image/gif" })]
    public IFormFile? Thumbnail { get; set; }

    [Required] public DateTime StartDate { get; set; }

    [Required] public DateTime EndDate { get; set; }
}