using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class SocialNetworkDto
    {
        public SocialNetworkTypeEnum Type { get; set; }
        public string Link { get; set; }
        public string Username { get; set; }
        public int OrganizationId { get; set; }
    }
}