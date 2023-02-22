using AutoMapper;
using WebApp.Data.Entities;
using WebApp.Models.Requests;
using WebApp.Models.Responses;

namespace WebApp.MappingProfiles;

public class ContestProfile : Profile
{
    public ContestProfile()
    {
        CreateMap<Contest, IndexContestsResponse>();
        CreateMap<Contest, ViewContestResponse>();

        CreateMap<CreateContestRequest, Contest>().ForMember(r => r.Exercise, o => o.Ignore())
            .ForMember(r => r.TopicHelp, o => o.Ignore());
        CreateMap<UpdateContestRequest, Contest>().ForMember(r => r.Exercise, o => o.Ignore())
            .ForMember(r => r.TopicHelp, o => o.Ignore());
    }
}