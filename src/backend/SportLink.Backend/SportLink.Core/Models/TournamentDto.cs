using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SportLink.Core.Models
{
    public class TournamentDto
    {
        public string Description { get; set; }
        public DateTime TimeFrom { get; set; }
        public DateTime TimeTo { get; set; }
        public decimal EntryFee { get; set; }

        public string Location { get; set; }

        public int OrganizationId { get; set; }
        public int SportId { get; set; }
    }
}