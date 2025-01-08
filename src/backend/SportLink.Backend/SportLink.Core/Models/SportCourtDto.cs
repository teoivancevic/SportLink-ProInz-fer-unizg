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
        public int AvailableCourts { get; set; }
        public int SportsObjectId { get; set; }
        public string CurrencyISO { get; set; }
        public decimal MinHourlyPrice { get; set; }
        public decimal MaxHourlyPrice { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int OrganizationId { get; set; }
        public List<WorkTimeDto> WorkTimes { get; set; }
    }
}