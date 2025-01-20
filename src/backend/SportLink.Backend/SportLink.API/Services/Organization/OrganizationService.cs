using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.API.Services.Email;
using SportLink.API.Services.Review;
using SportLink.API.Services.SportCourt;
using SportLink.API.Services.Tournament;
using SportLink.API.Services.TrainingGroup;
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
        private readonly IReviewService _reviewService;
        private readonly ISportCourtService _sportCourtService;
        private readonly ITrainingGroupService _trainingGroupService;
        private readonly ITournamentService _tournamentService;
        public OrganizationService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor,
                    IEmailService emailService, IReviewService reviewService, ISportCourtService sportCourtService,
                    ITrainingGroupService trainingGroupService, ITournamentService tournamentService)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
            _reviewService = reviewService;
            _sportCourtService = sportCourtService;
            _trainingGroupService = trainingGroupService;
            _tournamentService = tournamentService;
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
                var organizationOwner = await _context.Users.FindAsync(owner.Id);

                await _emailService.SendCreationEmailAsync(orgDto, organizationOwner.Email);

                return new OkObjectResult(orgDto);
            }
            else
            {
                return new BadRequestResult();
            }
        }

        public async Task<OrganizationDetailedDto> GetSingleOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization is not null && organization.VerificationStatus == VerificationStatusEnum.Accepted)
            {
                var (AverageRating, ReviewCount) = await _reviewService.GetOrganizationReviewStats(id);
                var rating = AverageRating;
                var profile = await _context.Organizations
                            .Include(x => x.SocialNetworks)
                            .Where(x => x.Id == id)
                            .Select(x => new OrganizationDetailedDto
                            {
                                Id = x.Id,
                                Name = x.Name,
                                Description = x.Description,
                                ContactEmail = x.ContactEmail,
                                ContactPhoneNumber = x.ContactPhoneNumber,
                                Location = x.Location,
                                Owner = new UserDto
                                {
                                    Id = x.Owner.Id,
                                    FirstName = x.Owner.FirstName,
                                    LastName = x.Owner.LastName
,
                                    Email = x.Owner.Email
                                },
                                Rating = rating,
                                SocialNetworks = x.SocialNetworks.Select(s => new SocialNetworkDto
                                {
                                    Type = s.Type,
                                    Link = s.Link,
                                    Username = s.Username,
                                    OrganizationId = s.OrganizationId
                                }).ToList()
                            }).FirstOrDefaultAsync();
                return profile!;
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
            var organizationOwner = await _context.Users.FindAsync(organization?.Owner.Id);
            if (organizationOwner is not null && organization?.VerificationStatus == VerificationStatusEnum.Unverified)
            {
                organizationOwner.RoleId = (int)RolesEnum.OrganizationOwner;
                organization.UpdatedAt = DateTime.Now;
                organization.VerificationStatus = VerificationStatusEnum.Accepted;
                //_context.Users.Update(organizationOwner);
                await _context.SaveChangesAsync();

                // await _emailService.SendApprovalEmailAsync(organization.ContactEmail);
                await _emailService.SendApprovalEmailAsync(organizationOwner.Email);
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
            var organizationOwner = await _context.Users.FindAsync(organization?.OwnerId);
            if (organization?.VerificationStatus == VerificationStatusEnum.Unverified)
            {
                organization.VerificationStatus = VerificationStatusEnum.Rejected;
                organization.RejectionResponse = reason;
                var orgDto = _mapper.Map<OrganizationDto>(organization);

                await _emailService.SendRejectionEmailAsync(orgDto, reason, organizationOwner.Email);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        // ---------------------- Organization's Profile ---------------------- //

        public async Task<ActionResult<OrganizationDetailedDto>> UpdateProfile(int id, OrganizationDetailedDto organizationDetailedDto)
        {
            var organization = await _context.Organizations.FindAsync(id);
            var existingSocialNetworks = await _context.SocialNetworks.Where(x => x.OrganizationId == id).ToListAsync();
            if (organization is not null && organization.VerificationStatus == VerificationStatusEnum.Accepted)
            {
                organization.Name = organizationDetailedDto.Name ?? organization.Name;
                organization.Description = organizationDetailedDto.Description ?? organization.Description;
                organization.ContactEmail = organizationDetailedDto.ContactEmail ?? organization.ContactEmail;
                organization.ContactPhoneNumber = organizationDetailedDto.ContactPhoneNumber ?? organization.ContactPhoneNumber;
                organization.Location = organizationDetailedDto.Location ?? organization.Location;
                List<SocialNetwork> updatedSocialNetworks = existingSocialNetworks;
                foreach (var sn in organizationDetailedDto.SocialNetworks)
                {
                    var existing = updatedSocialNetworks.FirstOrDefault(x => x.Type == sn.Type);
                    if (existing is null)
                    {
                        updatedSocialNetworks.Add(new SocialNetwork
                        {
                            Type = sn.Type,
                            Link = sn.Link,
                            Username = sn.Username,
                            OrganizationId = id
                        });
                    }
                    else if (existing is not null && (existing.Link != sn.Link || existing.Username != sn.Username))
                    {
                        existing.Link = sn.Link;
                        existing.Username = sn.Username;
                    }
                }

                for (int i = updatedSocialNetworks.Count - 1; i >= 0; i--)
                {
                    var sn = updatedSocialNetworks[i];
                    var matching = organizationDetailedDto.SocialNetworks?.FirstOrDefault(x => x.Type == sn.Type);
                    if (matching is null)
                    {
                        updatedSocialNetworks.RemoveAt(i);
                    }
                }

                organization.SocialNetworks = updatedSocialNetworks;
                await _context.SaveChangesAsync();

                return new OkObjectResult(organizationDetailedDto);
            }
            return null!;
        }

        public async Task<bool> DeleteOrganization(int id)
        {
            var organization = await _context.Organizations.FindAsync(id);
            if (organization is not null && organization.VerificationStatus == VerificationStatusEnum.Accepted)
            {
                _context.Organizations.Remove(organization);
                _context.SocialNetworks.RemoveRange(_context.SocialNetworks.Where(x => x.OrganizationId == id));
                await _reviewService.DeleteReview(id);
                await _tournamentService.DeleteTournament(id);
                await _trainingGroupService.DeleteTrainingGroup(id);
                await _sportCourtService.DeleteSportObject(id);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}