using AutoMapper;
using CreativeScienceTournament.Data.Entities;
using CreativeScienceTournament.Models.Requests;
using CreativeScienceTournament.Models.Responses;

namespace CreativeScienceTournament.MappingProfiles;

public class ApiUserProfile : Profile
{
    public ApiUserProfile()
    {
        CreateMap<RegisterRequest, ApiUser>();

        CreateMap<ApiUser, LoginResponseUser>();
        CreateMap<ApiUser, UserResponse>();
    }
}