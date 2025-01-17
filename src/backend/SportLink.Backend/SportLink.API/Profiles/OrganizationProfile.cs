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
    }
}