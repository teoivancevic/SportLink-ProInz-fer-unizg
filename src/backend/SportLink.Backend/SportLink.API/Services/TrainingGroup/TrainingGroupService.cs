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
            var trainingGroups = await _context.TrainingGroups.Where(x => x.OrganizationId == id).ToListAsync();
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
            trainingGroupDto.OrganizationId = id;
            //_context.TrainingGroups.Add(_mapper.Map<TrainingGroup>(trainingGroupDto));
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTrainingGroup(int id, TrainingGroupDto trainingGroup, int trainingGroupId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var trainingGroupToUpdate = await _context.TrainingGroups.FindAsync(trainingGroupId);
            if (trainingGroupToUpdate is null)
            {
                return false;
            }
            trainingGroup.OrganizationId = id;
            _mapper.Map(trainingGroup, trainingGroupToUpdate);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTrainingSchedule(int id, List<TrainingScheduleDto> trainingSchedule, int trainingGroupId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var trainingScheduleToUpdate = await _context.TrainingSchedules.Where(x => x.TrainingGroupId == trainingGroupId).ToListAsync();
            List<TrainingSchedule> trainingSchedulesToMap = trainingScheduleToUpdate;

            foreach (var ts in trainingSchedule)
            {

            }
            //trainingSchedule.TrainingGroupId = trainingGroupId;
            _mapper.Map(trainingSchedule, trainingScheduleToUpdate);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTrainingGroup(int id, int trainingGroupId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var trainingGroupToDelete = await _context.TrainingGroups.FindAsync(trainingGroupId);
            if (trainingGroupToDelete is null)
            {
                return false;
            }
            _context.TrainingGroups.Remove(trainingGroupToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}