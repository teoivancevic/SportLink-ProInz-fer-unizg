using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.User;
using SportLink.Core.Enums;
using SportLink.Core.Handlers;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IAuthHandler _authHandler;

    private readonly IUserService _userService;
    
    public AuthController(IUserService userService, IAuthHandler authHandler, IConfiguration configuration)
    {
        _configuration = configuration;
        _userService = userService;

        _authHandler = authHandler;
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
        var userDto = await _userService.RegisterUser(registerUser, RolesEnum.User);
        if (userDto is null)
            return BadRequest("User NOT created");
        return Ok(userDto);
    }

    /// <summary>
    /// Verify user with One-Time-Password code sent to email
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="otpCode"></param>
    /// <returns></returns>
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
    [HttpPost, AllowAnonymous]
    [Route("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginDto login)
    {
        var user = await _userService.GetUserByEmail(login.Email);
        if (user is null)
            return BadRequest("User not found.");

        var roleName = Enum.GetName(typeof(RolesEnum), user.RoleId);
        if (roleName is null)
            return BadRequest("Role not found.");
        
        var verifyLogin = await _userService.LoginCheckCredentials(user, login.Password);
        if (!verifyLogin)
            return BadRequest("Wrong pasword.");

        // var account = await _accountService.GetAccount(user.Id);
        // var accountId = account is null ? 0 : account.Id;

        

        string token = _authHandler.CreateToken(
            email: login.Email, 
            userId: $"{user.Id}",
            firstName: user.FirstName,
            lastName: user.LastName,
            roleName: roleName, 
            jwtKey: _configuration.GetSection("Jwt:Key").Value);
        
        return Ok(token);
    } 
}