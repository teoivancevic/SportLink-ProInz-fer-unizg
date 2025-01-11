﻿using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.Search;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class TrainingGroupController : ControllerBase
{
    private readonly ISearchService<TrainingGroupSearchDto, TrainingGroupSearchParameters> _searchService;

    public TrainingGroupController(ISearchService<TrainingGroupSearchDto, TrainingGroupSearchParameters> searchService)
    {
        _searchService = searchService;
    }

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
}