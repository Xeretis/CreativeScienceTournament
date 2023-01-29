using WebApp.Data.Entities.Owned;

namespace WebApp.Services.Interfaces;

public interface IContestService
{
    public Task<string> UploadThumbnailAsync(IFormFile image);
    public Task<Exercise> UploadExerciseAsync(IFormFile file);
}