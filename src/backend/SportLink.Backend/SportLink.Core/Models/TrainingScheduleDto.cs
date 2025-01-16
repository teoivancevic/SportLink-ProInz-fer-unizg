using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class TrainingScheduleDto
    {
        public int Id { get; set; }
        public DanUTjednuEnum DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int TrainingGroupId { get; set; }
    }
}