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

        [HttpGet]
        [Route("organization/{id}")]
        public async Task<ActionResult<List<SportObjectDto>>> GetSportCourts(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var sportCourts = await _sportCourtService.GetSportObjects(id);
            if (sportCourts.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Organizacija nema raspoloživih terena.");
            }
            return Ok(sportCourts);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> AddSportCourt(int id, [FromBody] SportObjectDto sportObject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _sportCourtService.AddSportObject(id, sportObject);
            if (!result)
            {
                return BadRequest("Teren neuspješno dodan.");
            }
            return Ok(sportObject);
        }

        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> UpdateSportCourt([FromBody] SportObjectDto sportObject, int idSportObject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _sportCourtService.UpdateSportObject(sportObject, idSportObject);
            if (!result)
            {
                return BadRequest("Teren neuspješno ažuriran.");
            }
            return Ok(result);
        }

        [HttpDelete, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> DeleteSportCourt(int idSportObject)
        {
            var result = await _sportCourtService.DeleteSportObject(idSportObject);
            if (!result)
            {
                return BadRequest("Teren neuspješno obrisan.");
            }
            return Ok(result);
        }
    }
}