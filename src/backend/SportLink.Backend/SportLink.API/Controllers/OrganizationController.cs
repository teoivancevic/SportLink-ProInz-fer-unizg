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

        /// <summary>
        /// Create a new organization
        /// </summary>
        /// <param name="organization"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Return all verified/unverified organizations (Admin only)
        /// </summary>
        /// <param name="isVerified"></param>
        /// <returns></returns>
        [HttpGet, Authorize(Roles = "AppAdmin", Policy = "jwt_policy")]
        [Route("Organizations")]
        public async Task<ActionResult<List<OrganizationDto>>> GetOrganizations([FromQuery] bool isVerified)
        {
            var result = await _organizationService.GetOrganizations(isVerified);
            return Ok(result);
        }

        /// <summary>
        /// Return single organization profile
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<OrganizationDetailedDto>> GetSingleOrganization(int id)
        {
            var organization = await _organizationService.GetSingleOrganization(id);
            if (organization is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            return Ok(organization);
        }

        /// <summary>
        /// Return my organizations
        /// </summary>
        /// <returns></returns>
        [HttpGet, Authorize(Roles = "OrganizationOwner, User", Policy = "jwt_policy")]
        [Route("myOrganizations")]
        public async Task<ActionResult<List<OrganizationDto>>> GetMyOrganizations()
        {
            var organizations = await _organizationService.GetMyOrganizations();
            return Ok(organizations);
        }

        /// <summary>
        /// Verify organization (Admin only)
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Decline organization (Admin only)
        /// </summary>
        /// <param name="id"></param>
        /// <param name="reason"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Update organization profile
        /// </summary>
        /// <param name="id"></param>
        /// <param name="profile"></param>
        /// <returns></returns>
        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> UpdateProfile(int id, [FromBody] OrganizationDetailedDto profile)
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

        /// <summary>
        /// Delete organization
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete, Authorize(Roles = "AppAdmin, OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> DeleteOrganization(int id)
        {
            var result = await _organizationService.DeleteOrganization(id);
            if (!result)
            {
                return BadRequest("Brisanje nije uspjelo.");
            }
            return Ok("Organizacija uspješno obrisana.");
        }
    }
}