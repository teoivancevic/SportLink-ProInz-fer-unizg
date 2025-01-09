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
        public static List<DayOfWeek> ToDaysOfWeekList(string daysOfWeekString) => daysOfWeekString.Split(',').Select(day => (DayOfWeek)Enum.Parse(typeof(DayOfWeek), day)).ToList();
        public static string ToDaysOfWeekString(List<DayOfWeek> daysOfWeek) => string.Join(",", daysOfWeek);
        public string OpenFrom { get; set; }
        public string OpenTo { get; set; }
    }
}