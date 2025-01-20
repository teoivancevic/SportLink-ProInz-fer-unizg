using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Profiles
{
    public class SportObjectProfile : Profile
    {
        public SportObjectProfile()
        {
            CreateMap<SportCourtDto, SportCourt>();
            CreateMap<SportCourt, SportCourtDto>();
            CreateMap<SportObjectDto, SportsObject>();
            CreateMap<SportsObject, SportObjectDto>();
        }
    }
}