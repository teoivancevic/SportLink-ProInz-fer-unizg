using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.Organization;
using SportLink.API.Services.Search;
using SportLink.API.Services.SportCourt;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class SportsObjectController : ControllerBase
{
    private readonly ISearchService<SportObjectSearchDto, SearchParameters> _searchService;
    private readonly ISportCourtService _sportCourtService;
    private readonly IOrganizationService _organizationService;

    public SportsObjectController(ISearchService<SportObjectSearchDto, SearchParameters> searchService,
        ISportCourtService sportCourtService, IOrganizationService organizationService)
    {
        _searchService = searchService;
        _sportCourtService = sportCourtService;
        _organizationService = organizationService;
    }

    /// <summary>
    /// Searches for SportObjects with parameters as filters
    /// </summary>
    /// <param name="parameters"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("search")]
    public async Task<ActionResult<List<SportObjectSearchDto>>> SearchAsync([FromQuery] SearchParameters parameters)
    {
        var results = await _searchService.SearchAsync(parameters);
        if (results is null)
        {
            return NotFound("No such Sport Objects found");
        }
        return Ok(results);
    }

    /// <summary>
    /// Return all sport objects by organization
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("organization/{id}")]
    public async Task<ActionResult<List<SportObjectDto>>> GetSportObjects(int id)
    {
        var org = await _organizationService.GetSingleOrganization(id);
        if (org is null)
        {
            return NotFound("Organizacija ne postoji.");
        }
        var sportCourts = await _sportCourtService.GetSportObjects(id);

        return Ok(sportCourts);
    }

    /// <summary>
    /// Add new sport object
    /// </summary>
    /// <param name="id"></param>
    /// <param name="sportObject"></param>
    /// <returns></returns>
    [HttpPost, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
    [Route("")]
    public async Task<ActionResult<bool>> AddSportObject(int id, [FromBody] SportObjectDto sportObject)
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

    /// <summary>
    /// Update sport object
    /// </summary>
    /// <param name="sportObject"></param>
    /// <param name="idSportObject"></param>
    /// <returns></returns>
    [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
    [Route("")]
    public async Task<ActionResult<bool>> UpdateSportObject([FromBody] SportObjectDto sportObject, int idSportObject)
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

    /// <summary>
    /// Delete sport object
    /// </summary>
    /// <param name="idSportObject"></param>
    /// <returns></returns>
    [HttpDelete, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
    [Route("")]
    public async Task<ActionResult<bool>> DeleteSportObject(int idSportObject)
    {
        var result = await _sportCourtService.DeleteSportObject(idSportObject);
        if (!result)
        {
            return BadRequest("Teren neuspješno obrisan.");
        }
        return Ok(result);
    }
}