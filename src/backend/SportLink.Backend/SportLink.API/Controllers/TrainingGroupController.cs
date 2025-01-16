using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Organization;
using SportLink.API.Services.Search;
using SportLink.API.Services.TrainingGroup;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingGroupController : ControllerBase
    {
        private readonly ITrainingGroupService _trainingGroupService;
        private readonly IOrganizationService _organizationService;
        private readonly ISearchService<TrainingGroupSearchDto, TrainingGroupSearchParameters> _searchService;

        public TrainingGroupController(ITrainingGroupService trainingGroupService, IOrganizationService organizationService,
            ISearchService<TrainingGroupSearchDto, TrainingGroupSearchParameters> searchService)
        {
            _trainingGroupService = trainingGroupService;
            _organizationService = organizationService;
            _searchService = searchService;
        }
        
        /// <summary>
        /// Searches TrainingGroups filtered by parameters
        /// </summary>
        /// <param name="searchParameters"></param>
        /// <returns>Returns TrainingGroupSearchDTOs with a List of TrainingScheduleDTOs</returns>
        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<List<TrainingGroupSearchDto>>> SearchAsync(
            [FromQuery] TrainingGroupSearchParameters searchParameters)
        {
            try
            {
                var result = await _searchService.SearchAsync(searchParameters);

                if (result == null || !result.Any())

                {
                    return NotFound("No training groups found matching the search criteria.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet, Authorize(Policy = "jwt_policy")]
        [Route("organization/{id}")]
        public async Task<ActionResult<List<TrainingGroupDto>>> GetTrainingGroups(int id)
        {
            var org = await _organizationService.GetSingleOrganization(id);
            if (org is null)
            {
                return NotFound("Organizacija ne postoji.");
            }
            var trainingGroups = await _trainingGroupService.GetTrainingGroups(id);
            if (trainingGroups.IsNullOrEmpty() && org is not null)
            {
                return NotFound("Nema formiranih grupa za trening.");
            }
            return Ok(trainingGroups);
        }

        [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> AddTrainingGroup(int id, [FromBody] TrainingGroupDto trainingGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _trainingGroupService.AddTrainingGroup(id, trainingGroup);
            if (!result)
            {
                return BadRequest("Grupa za trening neuspješno dodana.");
            }
            return Ok(trainingGroup);
        }

        [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> UpdateTrainingGroup([FromBody] TrainingGroupDto trainingGroup, int idTrainingGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _trainingGroupService.UpdateTrainingGroup(trainingGroup, idTrainingGroup);
            if (!result)
            {
                return BadRequest("Grupa za trening neuspješno ažuriran.");
            }
            return Ok(trainingGroup);
        }

        // [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        // [Route("{id}/update-training-schedule/{idTrainingGroup}")]
        // public async Task<ActionResult<bool>> UpdateTrainingSchedule(int id, [FromBody] List<TrainingScheduleDto> trainingSchedule, int idTrainingGroup)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }
        //     var result = await _trainingGroupService.UpdateTrainingSchedule(id, trainingSchedule, idTrainingGroup);
        //     if (!result)
        //     {
        //         return BadRequest("Grupa za trening neuspješno ažuriran.");
        //     }
        //     return Ok(trainingSchedule);
        // }

        [HttpDelete, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
        [Route("")]
        public async Task<ActionResult<bool>> DeleteTrainingGroup(int idTrainingGroup)
        {
            var result = await _trainingGroupService.DeleteTrainingGroup(idTrainingGroup);
            if (!result)
            {
                return BadRequest("Grupa za trening neuspješno obrisan.");
            }
            return Ok(result);
        }
    }
}