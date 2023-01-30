using WebApp.Data.Entities.Owned;

namespace WebApp.Services.Interfaces;

public interface IContestEntryService
{
    public Task<Solution> UploadSolutionAsync(IFormFile file);
}