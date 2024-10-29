using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.User;
using SportLink.Core.Models;

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
    [HttpPost, AllowAnonymous]
    [Route("register")]
    public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterUserDto user)
    {
        throw new NotImplementedException();
    } 
    
    /// <summary>
    /// Login user
    /// </summary>
    /// <returns>JWT Bearer token</returns>
    /// <exception cref="NotImplementedException"></exception>
    [HttpGet, AllowAnonymous]
    [Route("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginDto login)
    {
        throw new NotImplementedException();
    } 
}