using Microsoft.AspNetCore.Mvc;
using SportLink.API.Data.Entities;
using SportLink.API.Services.Sports;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class SportController : ControllerBase
{
    private readonly ISportService _sportService;

    public SportController(ISportService sportService)
    {
        _sportService = sportService;
    }

    [HttpGet]
    [Route("")]
    public async Task<ActionResult<List<SportDto>>> GetAllSportsAsync()
    {
        var sports = await _sportService.GetAllSportsAsync();
        if (sports == null)
        {
            return BadRequest("No sports found");
        }

        return Ok(sports);
    }
}