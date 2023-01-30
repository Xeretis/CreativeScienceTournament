using AutoMapper;
using WebApp.Data.Entities.Owned;
using WebApp.Models.Responses;

namespace WebApp.MappingProfiles;

public class CorrectionProfile : Profile
{
    public CorrectionProfile()
    {
        CreateMap<Correction, IndexContestEntriesResponseCorrection>();
        CreateMap<Correction, ViewContestEntryResponseCorrection>();
    }
}