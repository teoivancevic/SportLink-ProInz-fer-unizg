using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class WorkTimeDto
    {
        public int Id { get; set; }
        public int SportsObjectId { get; set; }
        public DanUTjednuEnum DayOfWeek { get; set; }
        public bool IsWorking { get; set; }
        public string? OpenFrom { get; set; }
        public string? OpenTo { get; set; }
    }
}