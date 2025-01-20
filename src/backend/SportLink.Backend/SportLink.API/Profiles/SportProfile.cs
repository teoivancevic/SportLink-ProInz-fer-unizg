using AutoMapper;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Profiles;

public class SportProfile : Profile
{
    public SportProfile()
    { 
        CreateMap<SportDto, Sport>();
        CreateMap<Sport, SportDto>();
    }
    
}