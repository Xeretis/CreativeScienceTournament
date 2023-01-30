using AutoMapper;
using WebApp.Data.Entities;
using WebApp.Models.Responses;

namespace WebApp.MappingProfiles;

public class ContestEntryProfile : Profile
{
    public ContestEntryProfile()
    {
        CreateMap<ContestEntry, IndexContestEntriesResponse>();
        CreateMap<ContestEntry, ViewContestEntryResponse>();
    }
}