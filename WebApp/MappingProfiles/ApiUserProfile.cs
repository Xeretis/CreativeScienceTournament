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
        CreateMap<ApiUser, IndexUsersResponse>().ForMember(r => r.Email, o => o.Ignore());
        CreateMap<ApiUser, ViewUserResponse>().ForMember(r => r.Email, o => o.Ignore());
        CreateMap<ApiUser, UserResponseTeamUser>();

        CreateMap<CreateUserRequest, ApiUser>();
        CreateMap<UpdateUserRequest, ApiUser>();
    }
}