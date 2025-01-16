using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Models;

namespace SportLink.API.Services.Organization
{
    public interface IOrganizationService
    {
        Task<ActionResult<OrganizationDto>> CreateOrganization(OrganizationDto organization);
        Task<List<OrganizationDto>> GetOrganizations(bool isVerified);
        Task<OrganizationDetailedDto> GetSingleOrganization(int id);
        Task<bool> VerifyOrganization(int id);
        Task<bool> DeclineOrganization(int id, string reason);
        Task<List<OrganizationDto>> GetMyOrganizations();
        Task<ActionResult<OrganizationDetailedDto>> UpdateProfile(int id, OrganizationDetailedDto organizationDetailedDto);
    }
}