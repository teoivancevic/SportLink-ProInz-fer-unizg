using Microsoft.AspNetCore.Mvc;

namespace SportLink.API.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult GetHealth()
    {
        return Ok("Health OK");
    }
}