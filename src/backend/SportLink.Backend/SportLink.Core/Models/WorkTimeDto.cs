using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SportLink.Core.Models
{
    public class WorkTimeDto
    {
        public int SportsObjectId { get; set; }
        public List<DayOfWeek> DaysOfWeek { get; set; }
        public TimeOnly OpenFrom { get; set; }
        public TimeOnly OpenTo { get; set; }
    }
}