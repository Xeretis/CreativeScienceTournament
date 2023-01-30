using AutoMapper;
using WebApp.Data.Entities;
using WebApp.Models.Requests;
using WebApp.Models.Responses;

namespace WebApp.MappingProfiles;

public class ApiUserProfile : Profile
{
    public ApiUserProfile()
    {
        CreateMap<ApiUser, LoginResponseUser>();
        CreateMap<ApiUser, UserResponse>();
        CreateMap<ApiUser, ViewTeamResponseUser>();
        CreateMap<ApiUser, IndexTeamResponseUser>();
        CreateMap<ApiUser, IndexUsersResponse>();
        CreateMap<ApiUser, ViewUserResponse>();
        CreateMap<ApiUser, UserResponseTeamUser>();

        CreateMap<CreateUserRequest, ApiUser>();
        CreateMap<UpdateUserRequest, ApiUser>();
    }
}