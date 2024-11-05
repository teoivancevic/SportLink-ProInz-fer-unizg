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
        private readonly OrganizationService _organizationService;

        public OrganizationController(OrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        // Post method for creating new organization
        [HttpPost, Authorize]
        [Route("CreateOrganization")]
        public async Task<ActionResult<OrganizationDto>> CreateOrganization([FromBody] OrganizationDto organization)
        {
            if (ModelState.IsValid)
            {
                var result = await _organizationService.CreateOrganization(organization);
                if (result.Result is BadRequestObjectResult badRequest)
                {
                    ModelState.AddModelError(string.Empty, badRequest.Value.ToString());
                    return BadRequest(ModelState);  // return View(organization)
                }
                return RedirectToAction("Home"); //Ok(organization);
            }
            return BadRequest(ModelState);
        }

        [HttpGet, Authorize]
        [Route("GetOrganizations?verified={isVerified}")]
        public async Task<ActionResult<OrganizationDto>> GetOrganizations([FromQuery] bool isVerified)
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
    }
}