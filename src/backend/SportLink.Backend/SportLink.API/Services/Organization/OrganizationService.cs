using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.Core.Models;

namespace SportLink.API.Services.Organization
{
    public class OrganizationService : IOrganizationService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public OrganizationService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ActionResult<OrganizationDto>> CreateOrganization(OrganizationDto organizationDto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var owner = await _context.Users.FindAsync(userId);
            var organization = new Data.Entities.Organization
            {
                Name = organizationDto.Name,
                Description = organizationDto.Description,
                ContactEmail = organizationDto.ContactEmail,
                ContactPhoneNumber = organizationDto.ContactPhoneNumber,
                Location = organizationDto.Location,
                OwnerId = int.Parse(userId!),
                IsVerified = false,
                Owner = owner!
            };
            await _context.Organizations.AddAsync(organization);
            await _context.SaveChangesAsync();

            var orgDto = _mapper.Map<OrganizationDto>(organization);

            return new OkObjectResult(orgDto);
        }

        public async Task<OrganizationDto> GetOrganizations(bool isVerified)
        {
            if (isVerified)
            {
                var organizations = await _context.Organizations.Where(x => x.IsVerified == true).ToListAsync();
                return _mapper.Map<OrganizationDto>(organizations);
            }
            else
            {
                var organizations = await _context.Organizations.Where(x => x.IsVerified == false).ToListAsync();
                return _mapper.Map<OrganizationDto>(organizations);
            }
        }

        public async Task<OrganizationDto> GetSingleOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            return _mapper.Map<OrganizationDto>(organization);
        }
    }
}