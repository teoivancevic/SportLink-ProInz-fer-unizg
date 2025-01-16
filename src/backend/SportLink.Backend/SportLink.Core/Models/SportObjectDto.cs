using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SportLink.Core.Models
{
    public class SportObjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int OrganizationId { get; set; }
        public List<SportCourtDto> SportCourts { get; set; }
        public List<WorkTimeDto> WorkTimes { get; set; }
    }
}