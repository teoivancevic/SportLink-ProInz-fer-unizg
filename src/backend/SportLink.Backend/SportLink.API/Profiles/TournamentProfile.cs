using AutoMapper;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Profiles;

public class TournamentProfile : Profile
{
    public TournamentProfile()
    {
        CreateMap<Tournament, TournamentSearchDto>()
            .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization.Name))
            .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.Sport.Name));
        CreateMap<TournamentSearchDto, Tournament>();
        CreateMap<TournamentDto, Tournament>();
        CreateMap<Tournament, TournamentDto>();
    }
}