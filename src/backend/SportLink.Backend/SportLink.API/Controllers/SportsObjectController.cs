using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.Search;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class SportsObjectController : ControllerBase
{
    private readonly ISearchService<SportObjectSearchDto, SearchParameters> _searchService;

    public SportsObjectController(ISearchService<SportObjectSearchDto, SearchParameters> searchService)
    {
        _searchService = searchService;
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
}