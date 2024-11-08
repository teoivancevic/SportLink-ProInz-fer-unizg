using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SportLink.API.Services.Organization;
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

        [HttpPost, Authorize]
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

        [HttpGet, Authorize(Roles = "AppAdmin")]
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

        [HttpGet, Authorize]
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

        [HttpGet, Authorize(Roles = "OrganizationOwner")]
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


        [HttpPut, Authorize(Roles = "AppAdmin")]
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

        [HttpPut, Authorize(Roles = "AppAdmin")]
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
    }
}