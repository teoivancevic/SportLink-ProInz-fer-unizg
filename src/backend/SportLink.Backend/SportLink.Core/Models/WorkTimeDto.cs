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
        // public static List<DayOfWeek> ToDaysOfWeekList(string daysOfWeekString) => daysOfWeekString.Split(',').Select(day => (DayOfWeek)Enum.Parse(typeof(DayOfWeek), day)).ToList();
        // public static string ToDaysOfWeekString(List<DayOfWeek> daysOfWeek) => string.Join(",", daysOfWeek);
        public bool IsWorking { get; set; }
        public string? OpenFrom { get; set; }
        public string? OpenTo { get; set; }
    }
}