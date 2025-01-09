using AutoMapper;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Profiles;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Review, GetReviewDto>()
            .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName)) 
            .ForMember(dest => dest.OrganizationName, opt => opt.MapFrom(src => src.Organization.Name))
            .ForMember(dest => dest.UserLastName, opt => opt.MapFrom(src => src.User.LastName));
        CreateMap<GetReviewDto, Review>();
    }
}