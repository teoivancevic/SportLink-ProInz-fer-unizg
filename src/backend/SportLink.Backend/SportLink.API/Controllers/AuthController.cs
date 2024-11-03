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
    /// </summary>s
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    [HttpPost, AllowAnonymous]
    [Route("register")]
    public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterUserDto registerUser)
    {
        var userDto = await _userService.RegisterUser(registerUser);
        if (userDto is null)
            return BadRequest("User NOT created");
        return Ok(userDto);
    }

    [HttpPut, AllowAnonymous]
    [Route("verify")]
    public async Task<ActionResult<bool>> VerifyUser(int userId, string otpCode)
    {
        var result = await _userService.VerifyUserEmail(userId, otpCode);
        if (!result)
            return BadRequest("Incorrect code");

        return Ok($"User {userId} verified");
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