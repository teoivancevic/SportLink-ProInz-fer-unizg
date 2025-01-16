using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.Search;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TournamentSearchController : ControllerBase
{
    private readonly ISearchService<TournamentSearchDto, TournamentSearchParameters> _searchService;

    public TournamentSearchController(ISearchService<TournamentSearchDto, TournamentSearchParameters> searchService)
    {
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
}