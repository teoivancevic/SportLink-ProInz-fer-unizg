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
        CreateMap<OrganizationDetailedDto, Organization>();
        CreateMap<Organization, OrganizationDetailedDto>();

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
        
        CreateMap<WorkTimeDto, WorkTime>()
            .ForMember(dest => dest.OpenFrom, opt => opt.MapFrom(src =>
                string.IsNullOrEmpty(src.OpenFrom) ? (TimeOnly?)null : TimeOnly.Parse(src.OpenFrom)))
            .ForMember(dest => dest.OpenTo, opt => opt.MapFrom(src =>
                string.IsNullOrEmpty(src.OpenTo) ? (TimeOnly?)null : TimeOnly.Parse(src.OpenTo)));
        CreateMap<WorkTime, WorkTimeDto>()
            .ForMember(dest => dest.OpenFrom, opt => opt.MapFrom(src =>
                src.OpenFrom.HasValue ? src.OpenFrom.Value.ToString("HH:mm") : null))
            .ForMember(dest => dest.OpenTo, opt => opt.MapFrom(src =>
                src.OpenTo.HasValue ? src.OpenTo.Value.ToString("HH:mm") : null));


    }
}