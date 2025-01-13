using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Organization;
using SportLink.API.Services.SportCourt;
using SportLink.Core.Models;

namespace SportLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SportCourtController : ControllerBase
    {
        private readonly ISportCourtService _sportCourtService;
        private readonly IOrganizationService _organizationService;

        public SportCourtController(ISportCourtService sportCourtService, IOrganizationService organizationService)
        {
            _sportCourtService = sportCourtService;
            _organizationService = organizationService;
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
            var sportCourts = await _sportCourtService.GetSportCourts(id);
            if (sportCourts.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Organizacija nema raspoloživih terena.");
            }
            return Ok(sportCourts);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{id}")]
        public async Task<ActionResult<bool>> AddSportCourt(int id, [FromBody] SportCourtDto sportCourt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _sportCourtService.AddSportCourt(id, sportCourt);
            if (!result)
            {
                return BadRequest("Teren neuspješno dodan.");
            }
            return Ok(sportCourt);
        }

        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{idSportCourt}")]
        public async Task<ActionResult<bool>> UpdateSportCourt(int id, [FromBody] SportCourtDto sportCourt, int idSportCourt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _sportCourtService.UpdateSportCourt(id, sportCourt, idSportCourt);
            if (!result)
            {
                return BadRequest("Teren neuspješno ažuriran.");
            }
            return Ok(sportCourt);
        }

        [HttpDelete, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("{idSportCourt}")]
        public async Task<ActionResult<bool>> DeleteSportCourt(int id, int idSportCourt)
        {
            var result = await _sportCourtService.DeleteSportCourt(id, idSportCourt);
            if (!result)
            {
                return BadRequest("Teren neuspješno obrisan.");
            }
            return Ok(result);
        }
    }
}