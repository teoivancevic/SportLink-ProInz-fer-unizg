using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SportLink.Core.Models
{
    public class SportCourtDto
    {
        public int Id { get; set; }
        public int SportId { get; set; }
        public string? SportName { get; set; }
        public int AvailableCourts { get; set; }
        public int SportsObjectId { get; set; }
        public decimal MaxHourlyPrice { get; set; }
    }
}