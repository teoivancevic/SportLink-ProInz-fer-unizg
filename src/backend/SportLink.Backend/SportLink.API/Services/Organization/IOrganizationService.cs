using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Models;

namespace SportLink.API.Services.Organization
{
    public interface IOrganizationService
    {
        Task<ActionResult<OrganizationDto>> CreateOrganization(OrganizationDto organization);
        //Task<OrganizationDto> CreateOrganization(OrganizationDto organization);
    }
}