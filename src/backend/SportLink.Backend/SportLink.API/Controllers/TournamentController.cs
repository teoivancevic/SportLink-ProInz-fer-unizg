using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Organization;
using SportLink.API.Services.Tournament;
using SportLink.Core.Models;

namespace SportLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TournamentController : ControllerBase
    {

        private readonly ITournamentService _tournamentService;
        private readonly IOrganizationService _organizationService;

        public TournamentController(ITournamentService tournamentService, IOrganizationService organizationService)
        {
            _tournamentService = tournamentService;
            _organizationService = organizationService;
        }

        [HttpGet, Authorize(Policy = "jwt_policy")]
        [Route("organization/{id}")]
        public async Task<ActionResult<List<TournamentDto>>> GetTournaments(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var tournaments = await _tournamentService.GetTournaments(id);
            if (tournaments.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Nema formiranih turnira.");
            }
            return Ok(tournaments);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> AddTournament([FromBody] TournamentDto tournament, int organizationId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _tournamentService.AddTournament(tournament, organizationId);
            if (!result)
            {
                return BadRequest("Turnir neuspješno dodan.");
            }
            return Ok(tournament);
        }

        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> UpdateTournament([FromBody] TournamentDto tournament, int idTournament)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _tournamentService.UpdateTournament(tournament, idTournament);
            if (!result)
            {
                return BadRequest("Turnir neuspješno ažuriran.");
            }
            return Ok(tournament);
        }

        [HttpDelete, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> DeleteTournament(int idTournament)
        {
            var result = await _tournamentService.DeleteTournament(idTournament);
            if (!result)
            {
                return BadRequest("Turnir neuspješno obrisan.");
            }
            return Ok(result);
        }
    }
}