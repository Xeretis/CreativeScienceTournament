using AutoMapper;
using CreativeScienceTournament.Data.Entities;
using CreativeScienceTournament.Models.Requests;
using CreativeScienceTournament.Models.Responses;

namespace CreativeScienceTournament.MappingProfiles;

public class TeamProfile : Profile
{
    public TeamProfile()
    {
        CreateMap<Team, ViewTeamResponse>()
            .ForMember(r => r.Points, o => o.MapFrom(t => t.PointEntries.Sum(e => e.Amount)));
        CreateMap<Team, IndexTeamResponse>()
            .ForMember(r => r.Points, o => o.MapFrom(t => t.PointEntries.Sum(e => e.Amount)));

        CreateMap<CreateTeamRequest, Team>();
        CreateMap<UpdateTeamRequest, Team>();
    }
}