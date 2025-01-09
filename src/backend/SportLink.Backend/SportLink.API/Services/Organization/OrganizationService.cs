using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
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
                var organizationOwner = await _context.Users.FindAsync(owner.Id);

                await _emailService.SendCreationEmailAsync(orgDto, organizationOwner.Email);

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

        // public async Task<ProfileDto> GetProfile(int id)
        // {
        //     var profile = await _context.Organizations.FindAsync(id);
        //     if (profile is not null && profile.VerificationStatus == VerificationStatusEnum.Accepted)
        //     {
        //         return _mapper.Map<ProfileDto>(profile);
        //     }

        //     return null!;
        // }

        public async Task<List<TournamentDto>> GetTournaments(int id)
        {
            var tournaments = await _context.Tournaments.Where(x => x.OrganizationId == id).ToListAsync();
            if (tournaments.IsNullOrEmpty())
            {
                return null!;
            }
            return _mapper.Map<List<TournamentDto>>(tournaments);
        }

        public async Task<List<TrainingGroupDto>> GetTrainingGroups(int id)
        {
            var trainingGroups = await _context.TrainingGroups.Where(x => x.OrganizationId == id).ToListAsync();
            if (trainingGroups.IsNullOrEmpty())
            {
                return null!;
            }
            return _mapper.Map<List<TrainingGroupDto>>(trainingGroups);
        }

        public async Task<List<SportCourtDto>> GetSportCourts(int id)
        {
            //var sportCourts = await _context.SportCourts.Include(sc => sc.SportsObject).Where(sc => sc.SportsObject.OrganizationId == id).ToListAsync();
            // var workTimes = await _context.WorkTimes.Where(wt => wt.SportsObjectId == 1).ToListAsync();
            // Console.WriteLine(workTimes);
            var sportCourts = await _context.SportCourts
            .Include(sc => sc.SportsObject) // Include the related SportsObject
            .ThenInclude(so => so.WorkTimes) // Include WorkTimes if needed
            .Where(sc => sc.SportsObject.OrganizationId == id) // Filter by OrganizationId
            .Select(sc => new SportCourtDto
            {
                SportId = sc.SportId,
                AvailableCourts = sc.AvailableCourts,
                SportsObjectId = sc.SportsObjectId,
                CurrencyISO = sc.CurrencyISO,
                MinHourlyPrice = sc.minHourlyPrice,
                MaxHourlyPrice = sc.maxHourlyPrice,
                Description = sc.SportsObject.Description,
                Location = sc.SportsObject.Location,
                OrganizationId = sc.SportsObject.OrganizationId,
                WorkTimes = sc.SportsObject.WorkTimes.Select(wt => new WorkTimeDto
                {
                    SportsObjectId = sc.SportsObjectId,
                    DaysOfWeek = WorkTimeDto.ToDaysOfWeekList(wt.DaysOfWeek),
                    OpenFrom = wt.OpenFrom.ToString(),
                    OpenTo = wt.OpenTo.ToString()
                }).ToList()
            })
            .ToListAsync();
            return sportCourts!;
            //return _mapper.Map<List<SportCourtDto>>(sportCourts);
        }

        public async Task<ActionResult<ProfileDto>> UpdateProfile(int id, ProfileDto profileDto)
        {
            var profile = await _context.Organizations.FindAsync(id);
            if (profile is not null && profile.VerificationStatus == VerificationStatusEnum.Accepted)
            {
                profile.Name = profileDto.Name ?? profile.Name;
                profile.Description = profileDto.Description ?? profile.Description;
                profile.ContactEmail = profileDto.ContactEmail ?? profile.ContactEmail;
                profile.ContactPhoneNumber = profileDto.ContactPhoneNumber ?? profile.ContactPhoneNumber;
                profile.Location = profileDto.Location ?? profile.Location;
                await _context.SaveChangesAsync();

                return new OkObjectResult(_mapper.Map<ProfileDto>(profile));
            }

            return null!;
        }

        public async Task<bool> AddTournament(int id, TournamentDto tournamentDto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            tournamentDto.OrganizationId = id;
            _context.Tournaments.Add(_mapper.Map<Tournament>(tournamentDto));
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddTrainingGroup(int id, TrainingGroupDto trainingGroupDto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            trainingGroupDto.OrganizationId = id;
            _context.TrainingGroups.Add(_mapper.Map<TrainingGroup>(trainingGroupDto));
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddSportCourt(int id, SportCourtDto sportCourtDto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }

            var sportsObject = new SportsObject
            {
                Description = sportCourtDto.Description,
                Location = sportCourtDto.Location,
                OrganizationId = sportCourtDto.OrganizationId,
                WorkTimes = sportCourtDto.WorkTimes.Select(wt => new WorkTime
                {
                    DaysOfWeek = WorkTimeDto.ToDaysOfWeekString(wt.DaysOfWeek),
                    OpenFrom = TimeOnly.Parse(wt.OpenFrom),
                    OpenTo = TimeOnly.Parse(wt.OpenTo)

                    //OpenFrom = new TimeOnly(wt.OpenFrom.Hour, wt.OpenFrom.Minute),
                    //OpenTo = new TimeOnly(wt.OpenTo.Hour, wt.OpenTo.Minute)
                    //OpenFrom = wt.OpenFrom.ToTimeOnly(),
                    //OpenTo = wt.OpenTo.ToTimeOnly()
                }).ToList()
            };

            //_context.CourtBookings.Add(_mapper.Map<SportCourt>(sportCourtDto)); krivo
            _context.SportsObjects.Add(sportsObject);
            await _context.SaveChangesAsync();

            var workTime = sportCourtDto.WorkTimes.Select(wt => new WorkTime
            {
                DaysOfWeek = WorkTimeDto.ToDaysOfWeekString(wt.DaysOfWeek),
                OpenFrom = TimeOnly.Parse(wt.OpenFrom),
                OpenTo = TimeOnly.Parse(wt.OpenTo),
                // OpenFrom = new TimeOnly(wt.OpenFrom.Hour, wt.OpenFrom.Minute),
                // OpenTo = new TimeOnly(wt.OpenTo.Hour, wt.OpenTo.Minute),
                SportsObjectId = sportCourtDto.SportsObjectId
            }).ToList();

            _context.WorkTimes.AddRange(workTime);
            await _context.SaveChangesAsync();

            var sportCourt = new SportCourt
            {
                SportId = sportCourtDto.SportId,
                AvailableCourts = sportCourtDto.AvailableCourts,
                CurrencyISO = sportCourtDto.CurrencyISO,
                minHourlyPrice = sportCourtDto.MinHourlyPrice,
                maxHourlyPrice = sportCourtDto.MaxHourlyPrice,
                SportsObjectId = sportsObject.Id
            };

            // zapravo: _context.SportCourts.Add(sportCourt);
            _context.SportCourts.Add(sportCourt);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}