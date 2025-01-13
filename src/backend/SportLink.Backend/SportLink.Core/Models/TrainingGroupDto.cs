using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class TrainingGroupDto
    {
        public string Name { get; set; }
        public int AgeFrom { get; set; }
        public int AgeTo { get; set; }
        public SexEnum Sex { get; set; }
        public decimal MonthlyPrice { get; set; }
        public string Description { get; set; }
        public int OrganizationId { get; set; }
        //public string OrganizationName { get; set; }
        public int SportId { get; set; }
        public string SportName { get; set; }
        //public List<TrainingScheduleDto> TrainingSchedules { get; set; }
    }

    public class TrainingScheduleDto
    {
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int TrainingGroupId { get; set; }
    }
}