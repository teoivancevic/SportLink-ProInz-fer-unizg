using SportLink.API.Data.Entities;
using SportLink.Core.Models;
using AutoMapper;
namespace SportLink.API.Profiles;

public class OrganizationProfile : Profile
{
    public OrganizationProfile()
    {
        CreateMap<OrganizationDto, Organization>();
        CreateMap<Organization, OrganizationDto>();
        CreateMap<TournamentDto, Tournament>();
        CreateMap<Tournament, TournamentDto>();
        CreateMap<TrainingGroupDto, TrainingGroup>();
        CreateMap<TrainingGroup, TrainingGroupDto>();
        CreateMap<TrainingScheduleDto, TrainingSchedule>();
        CreateMap<TrainingSchedule, TrainingScheduleDto>();
        CreateMap<SportCourtDto, SportCourt>();
        CreateMap<SportCourt, SportCourtDto>();
        CreateMap<SportObjectDto, SportsObject>();
        CreateMap<SportsObject, SportObjectDto>();
        CreateMap<ProfileDto, Organization>();
        CreateMap<Organization, ProfileDto>();
    }
}