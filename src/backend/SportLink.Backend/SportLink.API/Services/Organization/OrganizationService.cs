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

        //private readonly EmailService _emailService;
        public OrganizationService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            //_emailService = emailService;
        }

        public async Task<ActionResult<OrganizationDto>> CreateOrganization(OrganizationDto organizationDto)
        {
            // var authHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            // if (!string.IsNullOrEmpty(authHeader) && authHeader != "Bearer <token>")
            // {
            //     Console.WriteLine($"Authorization Header: {authHeader}");
            // }
            // else
            // {
            //     Console.WriteLine("Authorization header is missing.");
            // }

            // var claims = _httpContextAccessor.HttpContext?.User?.Claims;
            // foreach (var claim in claims)
            // {
            //     Console.WriteLine($"{claim.Type}: {claim.Value}");
            // }
            var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            //var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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

                return new OkObjectResult(orgDto);
            }
            else
            {
                return new BadRequestResult();
            }
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

        public async Task<OrganizationDto> GetSingleOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            return _mapper.Map<OrganizationDto>(organization);
        }

        public async Task<bool> VerifyOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization is null)
            {
                return false;
            }
            else
            {
                organization.VerificationStatus = VerificationStatusEnum.Accepted;
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeclineOrganization(int id, string reason)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization is null)
            {
                return false;
            }
            else
            {
                organization.VerificationStatus = VerificationStatusEnum.Rejected;
                organization.RejectionResponse = reason;
                //_emailService.SendEmailAsync(organization.ContactEmail, "Organization verification declined", reason);
                await _context.SaveChangesAsync();
                return true;
            }
        }
    }
}