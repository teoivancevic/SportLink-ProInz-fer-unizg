using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Profiles
{
    public class TrainingGroupProfile : Profile
    {
        public TrainingGroupProfile()
        {
            CreateMap<TrainingGroupDto, TrainingGroup>();
            CreateMap<TrainingGroup, TrainingGroupDto>();
            CreateMap<TrainingScheduleDto, TrainingSchedule>();
            CreateMap<TrainingSchedule, TrainingScheduleDto>();
        }
    }
}