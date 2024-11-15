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
using SportLink.API.Services.Email;
using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.Organization
{
    public class OrganizationService : IOrganizationService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;
        public OrganizationService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor, IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
        }

        public async Task<ActionResult<OrganizationDto>> CreateOrganization(OrganizationDto organizationDto)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var owner = await _context.Users.FindAsync(int.Parse(userId!));
            if (userId is not null && owner is not null)
            {
                var organization = new Data.Entities.Organization
                {
                    Name = organizationDto.Name,
                    Description = organizationDto.Description,
                    ContactEmail = organizationDto.ContactEmail,
                    ContactPhoneNumber = organizationDto.ContactPhoneNumber,
                    Location = organizationDto.Location,
                    OwnerId = int.Parse(userId),
                    VerificationStatus = VerificationStatusEnum.Unverified,
                    Owner = owner
                };
                await _context.Organizations.AddAsync(organization);
                await _context.SaveChangesAsync();

                var orgDto = _mapper.Map<OrganizationDto>(organization);

                await _emailService.SendCreationEmailAsync(orgDto);

                return new OkObjectResult(orgDto);
            }
            else
            {
                return new BadRequestResult();
            }
        }

        public async Task<OrganizationDto> GetSingleOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization is not null && organization.VerificationStatus == VerificationStatusEnum.Accepted)
            {
                return _mapper.Map<OrganizationDto>(organization);
            }
            else
            {
                return null!;
            }
        }

        public async Task<List<OrganizationDto>> GetMyOrganizations()
        {
            var ownerId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var organizations = await _context.Organizations.Where(x => x.OwnerId == int.Parse(ownerId!) && x.VerificationStatus == VerificationStatusEnum.Accepted).ToListAsync();
            return _mapper.Map<List<OrganizationDto>>(organizations);
        }

        public async Task<List<OrganizationDto>> GetOrganizations(bool isVerified)
        {
            if (isVerified)
            {
                var organizations = await _context.Organizations.Where(x => x.VerificationStatus == VerificationStatusEnum.Accepted).ToListAsync();
                return _mapper.Map<List<OrganizationDto>>(organizations);
            }
            else
            {
                var organizations = await _context.Organizations.Where(x => x.VerificationStatus == VerificationStatusEnum.Unverified).ToListAsync();
                return _mapper.Map<List<OrganizationDto>>(organizations);
            }
        }

        public async Task<bool> VerifyOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            var organizationOwner = await _context.Users.FindAsync(organization?.OwnerId);
            if (organizationOwner is not null && organization?.VerificationStatus == VerificationStatusEnum.Unverified)
            {
                organizationOwner.RoleId = (int)RolesEnum.OrganizationOwner;
                organization.UpdatedAt = DateTime.Now;
                organization.VerificationStatus = VerificationStatusEnum.Accepted;
                //_context.Users.Update(organizationOwner);
                await _context.SaveChangesAsync();

                await _emailService.SendApprovalEmailAsync(organization.ContactEmail);
                return true;
            }
            else
            {
                return false;
            }
        }


        public async Task<bool> DeclineOrganization(int id, string reason)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization?.VerificationStatus == VerificationStatusEnum.Unverified)
            {
                organization.VerificationStatus = VerificationStatusEnum.Rejected;
                organization.RejectionResponse = reason;
                var orgDto = _mapper.Map<OrganizationDto>(organization);

                await _emailService.SendRejectionEmailAsync(orgDto, reason);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}