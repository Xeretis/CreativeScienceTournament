using WebApp.Data.Entities.Owned;
using WebApp.Services.Interfaces;

namespace WebApp.Services.Implementations;

public class ContestService : IContestService
{
    public async Task<string> UploadThumbnailAsync(IFormFile image)
    {
        var uniqueFileName = GetUniqueFileName(image.FileName);
        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Images");
        var filePath = Path.Combine(uploads, uniqueFileName);
        await image.CopyToAsync(new FileStream(filePath, FileMode.Create));

        return Path.Combine("Images", uniqueFileName);
    }

    public async Task<Exercise> UploadExerciseAsync(IFormFile file)
    {
        var uniqueFileName = GetUniqueFileName(file.FileName);
        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Exercises");
        var filePath = Path.Combine(uploads, uniqueFileName);
        await file.CopyToAsync(new FileStream(filePath, FileMode.Create));

        return new Exercise
        {
            Filename = uniqueFileName,
            OriginalFilename = file.FileName,
            ContentType = file.ContentType
        };
    }

    public async Task<TopicHelp> UploadTopicHelpAsync(IFormFile file)
    {
        var uniqueFileName = GetUniqueFileName(file.FileName);
        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "TopicHelp");
        var filePath = Path.Combine(uploads, uniqueFileName);
        await file.CopyToAsync(new FileStream(filePath, FileMode.Create));

        return new TopicHelp
        {
            Filename = uniqueFileName,
            OriginalFilename = file.FileName,
            ContentType = file.ContentType
        };
    }

    private string GetUniqueFileName(string fileName)
    {
        fileName = Path.GetFileName(fileName);
        return string.Concat(Path.GetFileNameWithoutExtension(fileName)
            , "_"
            , Guid.NewGuid().ToString().AsSpan(0, 8)
            , Path.GetExtension(fileName));
    }
}