using AutoMapper;
using CreativeScienceTournament.Data.Entities;
using CreativeScienceTournament.Models.Requests;
using CreativeScienceTournament.Models.Responses;

namespace CreativeScienceTournament.MappingProfiles;

public class ApiUserProfile : Profile
{
    public ApiUserProfile()
    {
        CreateMap<CreateUserRequest, ApiUser>();
        CreateMap<UpdateUserRequest, ApiUser>();

        CreateMap<ApiUser, LoginResponseUser>();
        CreateMap<ApiUser, UserResponse>();
        CreateMap<ApiUser, ViewTeamResponseUser>();
        CreateMap<ApiUser, IndexTeamResponseUser>();
        CreateMap<ApiUser, IndexUsersResponse>();
        CreateMap<ApiUser, ViewUserResponse>();
    }
}