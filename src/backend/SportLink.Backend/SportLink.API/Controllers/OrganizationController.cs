using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Organization;
using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizationController : ControllerBase
    {
        private readonly IOrganizationService _organizationService;

        public OrganizationController(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner,User", Policy = "jwt_policy")]
        [Route("CreateOrganization")]
        public async Task<ActionResult<OrganizationDto>> CreateOrganization([FromBody] OrganizationDto organization)
        {
            if (ModelState.IsValid)
            {
                var result = await _organizationService.CreateOrganization(organization);
                if (result.Result is BadRequestObjectResult badRequest)
                {
                    ModelState.AddModelError(string.Empty, badRequest?.Value!.ToString()!);
                    return BadRequest(ModelState);
                }
                return Ok(organization);
            }
            return BadRequest(ModelState);
        }

        [HttpGet, Authorize(Roles = "AppAdmin", Policy = "jwt_policy")]
        [Route("Organizations")]
        public async Task<ActionResult<List<OrganizationDto>>> GetOrganizations([FromQuery] bool isVerified)
        {
            var result = await _organizationService.GetOrganizations(isVerified);
            if (result is null && isVerified)
            {
                return NotFound("Nema potvrđenih organizacija.");
            }
            else if (result is null && !isVerified)
            {
                return NotFound("Nema organizacija koje čekaju potvrdu.");
            }
            else
            {
                return Ok(result);
            }
        }

        [HttpGet, Authorize(Policy = "jwt_policy")]
        [Route("{id}")]
        public async Task<ActionResult<OrganizationDto>> GetSingleOrganization(int id)
        {
            var organization = await _organizationService.GetSingleOrganization(id);
            if (organization is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            return Ok(organization);
        }

        [HttpGet, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("myOrganizations")]
        public async Task<ActionResult<List<OrganizationDto>>> GetMyOrganizations()
        {
            var organizations = await _organizationService.GetMyOrganizations();
            if (organizations is null)
            {
                return NotFound("Nemate vlastitih organizacija.");
            }
            else
            {
                return Ok(organizations);
            }
        }


        [HttpPut, Authorize(Roles = "AppAdmin", Policy = "jwt_policy")]
        [Route("{id}/verify")]
        public async Task<ActionResult<bool>> VerifyOrganization(int id)
        {
            var result = await _organizationService.VerifyOrganization(id);
            if (!result)
            {
                return BadRequest("Verifikacija nije uspjela.");
            }
            return Ok("Organizacija uspješno potvrđena.");
        }

        [HttpPut, Authorize(Roles = "AppAdmin", Policy = "jwt_policy")]
        [Route("{id}/decline")]
        public async Task<ActionResult<bool>> DeclineOrganization(int id, [FromBody] string reason)
        {
            var result = await _organizationService.DeclineOrganization(id, reason);
            if (!result)
            {
                return BadRequest("Odbijanje nije uspjelo.");
            }
            return Ok("Organizacija uspješno odbijena.");
        }

        // ---------------------- Organization's Profile ---------------------- //

        // [HttpGet, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]        // Roles?
        // [Route("{id}")]
        // public async Task<ActionResult<ProfileDto>> GetProfile(int id)
        // {
        //     var profile = await _organizationService.GetProfile(id);
        //     if (profile is null)
        //     {
        //         return NotFound("Profil organizacije ne postoji.");
        //     }
        //     return Ok(profile);
        // }

        [HttpGet, Authorize(Policy = "jwt_policy")]
        [Route("{id}/tournaments")]
        public async Task<ActionResult<List<TournamentDto>>> GetTournaments(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var tournaments = await _organizationService.GetTournaments(id);
            if (tournaments.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Nema formiranih turnira.");
            }
            return Ok(tournaments);
        }

        [HttpGet, Authorize(Policy = "jwt_policy")]
        [Route("{id}/training-groups")]
        public async Task<ActionResult<List<TrainingGroupDto>>> GetTrainingGroups(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var trainingGroups = await _organizationService.GetTrainingGroups(id);
            if (trainingGroups.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Nema formiranih grupa za trening.");
            }
            return Ok(trainingGroups);
        }

        [HttpGet, Authorize(Policy = "jwt_policy")]
        [Route("{id}/sport-courts")]
        public async Task<ActionResult<List<SportCourtDto>>> GetSportCourts(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var sportCourts = await _organizationService.GetSportCourts(id);
            if (sportCourts.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Organizacija nema raspoloživih terena.");
            }
            return Ok(sportCourts);
        }

        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{id}/update")]
        public async Task<ActionResult<bool>> UpdateProfile(int id, [FromBody] ProfileDto profile)
        {
            if (ModelState.IsValid)
            {
                var result = await _organizationService.UpdateProfile(id, profile);
                if (result is null)
                {
                    return BadRequest("Profil neuspješno ažuriran.");
                }
                return Ok(profile);
            }
            return BadRequest(ModelState);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{id}/add-tournament")]
        public async Task<ActionResult<bool>> AddTournament(int id, [FromBody] TournamentDto tournament)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _organizationService.AddTournament(id, tournament);
            if (!result)
            {
                return BadRequest("Turnir neuspješno dodan.");
            }
            return Ok(tournament);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{id}/add-training-group")]
        public async Task<ActionResult<bool>> AddTrainingGroup(int id, [FromBody] TrainingGroupDto trainingGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _organizationService.AddTrainingGroup(id, trainingGroup);
            if (!result)
            {
                return BadRequest("Grupa za trening neuspješno dodana.");
            }
            return Ok(trainingGroup);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{id}/add-sport-court")]
        public async Task<ActionResult<bool>> AddSportCourt(int id, [FromBody] SportCourtDto sportCourt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _organizationService.AddSportCourt(id, sportCourt);
            if (!result)
            {
                return BadRequest("Teren neuspješno dodan.");
            }
            return Ok(sportCourt);
        }
    }
}