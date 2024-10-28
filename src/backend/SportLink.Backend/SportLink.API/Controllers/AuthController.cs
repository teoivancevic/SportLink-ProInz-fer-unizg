using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.User;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    
    private readonly IUserService _userService;
    
    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Register new user
    /// </summary>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> RegisterUser()
    {
        throw new NotImplementedException();
    } 
    
    /// <summary>
    /// Login user
    /// </summary>
    /// <returns>JWT Bearer token</returns>
    /// <exception cref="NotImplementedException"></exception>
    [HttpGet]
    [Route("login")]
    public async Task<IActionResult> Login()
    {
        throw new NotImplementedException();
    } 
}