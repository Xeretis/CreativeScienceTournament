using AutoMapper;
using WebApp.Data.Entities;
using WebApp.Models.Requests;
using WebApp.Models.Responses;

namespace WebApp.MappingProfiles;

public class TeamProfile : Profile
{
    public TeamProfile()
    {
        CreateMap<Team, ViewTeamResponse>()
            .ForMember(r => r.Points, o => o.MapFrom(t => t.PointEntries.Sum(e => e.Amount)));
        CreateMap<Team, IndexTeamsResponse>()
            .ForMember(r => r.Points, o => o.MapFrom(t => t.PointEntries.Sum(e => e.Amount)));
        CreateMap<Team, ViewContestResponseTeam>()
            .ForMember(r => r.Points, o => o.MapFrom(t => t.PointEntries.Sum(e => e.Amount)));
        CreateMap<Team, UserResponseTeam>()
            .ForMember(r => r.Points, o => o.MapFrom(t => t.PointEntries.Sum(e => e.Amount)));

        CreateMap<CreateTeamRequest, Team>();
        CreateMap<UpdateTeamRequest, Team>();
    }
}