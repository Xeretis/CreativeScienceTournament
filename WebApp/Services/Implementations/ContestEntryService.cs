using WebApp.Data.Entities.Owned;
using WebApp.Services.Interfaces;

namespace WebApp.Services.Implementations;

public class ContestEntryService : IContestEntryService
{
    public async Task<Solution> UploadSolutionAsync(IFormFile file)
    {
        var uniqueFileName = GetUniqueFileName(file.FileName);
        var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Solutions");
        var filePath = Path.Combine(uploads, uniqueFileName);
        await file.CopyToAsync(new FileStream(filePath, FileMode.Create));

        return new Solution
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