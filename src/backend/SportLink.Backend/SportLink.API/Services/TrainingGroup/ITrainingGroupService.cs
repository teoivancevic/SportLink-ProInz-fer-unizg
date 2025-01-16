using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Models;

namespace SportLink.API.Services.TrainingGroup
{
    public interface ITrainingGroupService
    {
        Task<bool> AddTrainingGroup(int id, TrainingGroupDto trainingGroup);
        Task<List<TrainingGroupDto>> GetTrainingGroups(int id);
        Task<bool> UpdateTrainingGroup(TrainingGroupDto trainingGroup, int idTrainingGroup);
        Task<bool> DeleteTrainingGroup(int idTrainingGroup);
        //Task<bool> UpdateTrainingSchedule(int id, List<TrainingScheduleDto> trainingSchedule, int idTrainingGroup);
    }
}