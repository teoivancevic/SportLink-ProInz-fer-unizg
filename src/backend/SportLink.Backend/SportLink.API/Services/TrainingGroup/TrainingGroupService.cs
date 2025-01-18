using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Services.TrainingGroup
{
    public class TrainingGroupService : ITrainingGroupService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public TrainingGroupService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TrainingGroupDto>> GetTrainingGroups(int id)
        {
            var trainingGroups = await _context.TrainingGroups.Include(x => x.TrainingSchedules).Include(x => x.Sport)
                .Where(x => x.OrganizationId == id)
                .Select(
                x => new TrainingGroupDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    SportName = x.Sport.Name,
                    SportId = x.SportId,
                    AgeFrom = x.AgeFrom,
                    AgeTo = x.AgeTo,
                    Sex = x.Sex,
                    MonthlyPrice = x.MonthlyPrice,
                    Description = x.Description,
                    OrganizationId = x.OrganizationId,
                    TrainingSchedules = x.TrainingSchedules.Select(s => new TrainingScheduleDto
                    {
                        DayOfWeek = s.DayOfWeek,
                        StartTime = s.StartTime.ToString(),
                        EndTime = s.EndTime.ToString(),
                        TrainingGroupId = s.TrainingGroupId
                    }).ToList(),
                }
            ).ToListAsync();

            if (trainingGroups.IsNullOrEmpty())
            {
                return null!;
            }
            return _mapper.Map<List<TrainingGroupDto>>(trainingGroups);
        }

        public async Task<bool> AddTrainingGroup(int id, TrainingGroupDto trainingGroupDto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var trainingGroup = new Data.Entities.TrainingGroup
            {
                Name = trainingGroupDto.Name,
                SportId = trainingGroupDto.SportId,
                AgeFrom = trainingGroupDto.AgeFrom,
                AgeTo = trainingGroupDto.AgeTo,
                Sex = trainingGroupDto.Sex,
                MonthlyPrice = trainingGroupDto.MonthlyPrice,
                Description = trainingGroupDto.Description,
                OrganizationId = id
            };
            _context.TrainingGroups.Add(trainingGroup);
            await _context.SaveChangesAsync();

            foreach (var ts in trainingGroupDto.TrainingSchedules)
            {
                var trainingSchedule = new TrainingSchedule
                {
                    DayOfWeek = ts.DayOfWeek,
                    StartTime = TimeOnly.Parse(ts.StartTime),
                    EndTime = TimeOnly.Parse(ts.EndTime),
                    TrainingGroupId = trainingGroup.Id
                };
                _context.TrainingSchedules.Add(trainingSchedule);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTrainingGroup(TrainingGroupDto trainingGroup, int trainingGroupId)
        {
            var trainingGroupToUpdate = await _context.TrainingGroups.FindAsync(trainingGroupId);
            if (trainingGroupToUpdate is null)
            {
                return false;
            }
            else
            {
                trainingGroupToUpdate.Name = trainingGroup.Name ?? trainingGroupToUpdate.Name;
                if (trainingGroup.AgeFrom != trainingGroupToUpdate.AgeFrom)
                {
                    trainingGroupToUpdate.AgeFrom = trainingGroup.AgeFrom;
                }

                if (trainingGroup.AgeTo != trainingGroupToUpdate.AgeTo)
                {
                    trainingGroupToUpdate.AgeTo = trainingGroup.AgeTo;
                }

                if (trainingGroup.Sex != trainingGroupToUpdate.Sex)
                {
                    trainingGroupToUpdate.Sex = trainingGroup.Sex;
                }

                if (trainingGroup.MonthlyPrice != trainingGroupToUpdate.MonthlyPrice)
                {
                    trainingGroupToUpdate.MonthlyPrice = trainingGroup.MonthlyPrice;
                }

                trainingGroupToUpdate.Description = trainingGroup.Description ?? trainingGroupToUpdate.Description;

                if (trainingGroup.SportId != trainingGroupToUpdate.SportId)
                {
                    trainingGroupToUpdate.SportId = trainingGroup.SportId;
                }

                List<TrainingSchedule> existingTrainingSchedules = await _context.TrainingSchedules.Where(x => x.TrainingGroupId == trainingGroupId).ToListAsync();
                foreach (var ts in trainingGroup.TrainingSchedules)
                {
                    var matchingTrainingSchedule = existingTrainingSchedules.FirstOrDefault(x => x.Id == ts.Id);
                    if (matchingTrainingSchedule is null)
                    {
                        var trainingSchedule = new TrainingSchedule
                        {
                            DayOfWeek = ts.DayOfWeek,
                            StartTime = TimeOnly.Parse(ts.StartTime),
                            EndTime = TimeOnly.Parse(ts.EndTime),
                            TrainingGroupId = trainingGroupId
                        };
                        _context.TrainingSchedules.Add(trainingSchedule);
                        await _context.SaveChangesAsync();
                        ts.Id = trainingSchedule.Id;
                    }
                    else if (matchingTrainingSchedule is not null && (ts.DayOfWeek != matchingTrainingSchedule.DayOfWeek
                                                                        || ts.StartTime != matchingTrainingSchedule.StartTime.ToString()
                                                                        || ts.EndTime != matchingTrainingSchedule.EndTime.ToString()))
                    {
                        matchingTrainingSchedule.DayOfWeek = ts.DayOfWeek;
                        matchingTrainingSchedule.StartTime = TimeOnly.Parse(ts.StartTime);
                        matchingTrainingSchedule.EndTime = TimeOnly.Parse(ts.EndTime);

                    }
                }
                await _context.SaveChangesAsync();

                var schedulesToRemove = _context.TrainingSchedules.Where(x => x.TrainingGroupId == trainingGroupId).ToList();
                foreach (var ts in schedulesToRemove)
                {
                    var existingTrainingSchedule = trainingGroup.TrainingSchedules.FirstOrDefault(x => x.Id == ts.Id);
                    if (existingTrainingSchedule is null)
                    {
                        _context.TrainingSchedules.Remove(ts);
                    }
                }
                //
                trainingGroup.OrganizationId = trainingGroupId;
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeleteTrainingGroup(int trainingGroupId)
        {
            var trainingGroupToDelete = await _context.TrainingGroups.FindAsync(trainingGroupId);
            if (trainingGroupToDelete is null)
            {
                return false;
            }
            _context.TrainingGroups.Remove(trainingGroupToDelete);
            _context.TrainingSchedules.RemoveRange(_context.TrainingSchedules.Where(x => x.TrainingGroupId == trainingGroupId));
            await _context.SaveChangesAsync();
            return true;
        }
    }
}