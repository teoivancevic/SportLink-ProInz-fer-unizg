using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class TrainingGroupDto
    {
        public int Id { get; set; }
        public int AgeFrom { get; set; }
        public int AgeTo { get; set; }
        public SexEnum Sex { get; set; }
        public decimal MonthlyPrice { get; set; }
        public string Description { get; set; }
        public int OrganizationId { get; set; }
        public int SportId { get; set; }
    }
}