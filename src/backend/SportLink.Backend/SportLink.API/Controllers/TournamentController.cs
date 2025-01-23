using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Organization;
using SportLink.API.Services.Search;
using SportLink.API.Services.Tournament;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TournamentController : ControllerBase
    {

        private readonly ITournamentService _tournamentService;
        private readonly IOrganizationService _organizationService;
        private readonly ISearchService<TournamentSearchDto, TournamentSearchParameters> _searchService;

        public TournamentController(ITournamentService tournamentService, IOrganizationService organizationService,
            ISearchService<TournamentSearchDto, TournamentSearchParameters> searchService)
        {
            _tournamentService = tournamentService;
            _organizationService = organizationService;
            _searchService = searchService;
        }

        /// <summary>
        /// Search filtered tournaments
        /// </summary>
        /// <param name="parameters"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<List<TournamentSearchDto>>> SearchAsync([FromQuery] TournamentSearchParameters parameters)
        {
            try
            {
                var results = await _searchService.SearchAsync(parameters);
                if (results == null)
                {
                    return NotFound("No such Sport Objects found");
                }
                return Ok(results);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// Return tournaments by organization
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("organization/{id}")]
        public async Task<ActionResult<List<TournamentDto>>> GetTournaments(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var tournaments = await _tournamentService.GetTournaments(id);
            return Ok(tournaments);
        }

        /// <summary>
        /// Add new tournament
        /// </summary>
        /// <param name="tournament"></param>
        /// <param name="organizationId"></param>
        /// <returns></returns>
        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> AddTournament([FromBody] TournamentDto tournament, int organizationId)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                .Where(m => m.Value.Errors.Count > 0)
                .Select(m => new
                {
                    Field = m.Key,
                    Messages = m.Value.Errors.Select(e => e.ErrorMessage)
                });
                return BadRequest(new { errors });
            }
            var result = await _tournamentService.AddTournament(tournament, organizationId);
            if (!result)
            {
                return BadRequest("Turnir neuspješno dodan.");
            }
            return Ok(tournament);
        }

        /// <summary>
        /// Update tournament
        /// </summary>
        /// <param name="tournament"></param>
        /// <param name="idTournament"></param>
        /// <returns></returns>
        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> UpdateTournament([FromBody] TournamentDto tournament, int idTournament)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                .Where(m => m.Value.Errors.Count > 0)
                .Select(m => new
                {
                    Field = m.Key,
                    Messages = m.Value.Errors.Select(e => e.ErrorMessage)
                });
                return BadRequest(new { errors });
            }
            var result = await _tournamentService.UpdateTournament(tournament, idTournament);
            if (!result)
            {
                return BadRequest("Turnir neuspješno ažuriran.");
            }
            return Ok(tournament);
        }

        /// <summary>
        /// Delete tournament
        /// </summary>
        /// <param name="idTournament"></param>
        /// <returns></returns>
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