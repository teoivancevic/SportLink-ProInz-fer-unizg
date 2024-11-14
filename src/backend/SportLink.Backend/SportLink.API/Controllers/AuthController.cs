using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.Auth;
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
    private readonly IAuthService _authService;

    public AuthController(IUserService userService, IAuthService authService, IAuthHandler authHandler, IConfiguration configuration)
    {
        _configuration = configuration;
        _authHandler = authHandler;

        _userService = userService;
        _authService = authService;
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
        var userDto = await _authService.RegisterUser(registerUser, RolesEnum.User);
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
        var result = await _authService.VerifyUserEmail(userId, otpCode);
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
            return BadRequest("Wrong username or password.");

        var roleName = Enum.GetName(typeof(RolesEnum), user.RoleId);
        if (roleName is null)
            return BadRequest("Wrong username or password.");

        var verifyLogin = await _authService.LoginCheckCredentials(user, login.Password);
        if (!verifyLogin)
            return BadRequest("Wrong username or pasword.");


        string token = _authHandler.CreateToken(
            email: login.Email,
            userId: $"{user.Id}",
            firstName: user.FirstName,
            lastName: user.LastName,
            roleName: roleName,
            jwtKey: _configuration.GetSection("Jwt:Key").Value);

        return Ok(token);
    }

    [HttpPut, AllowAnonymous]
    [Route("resendOTP")]
    public async Task<ActionResult> ResendOTPCode(int userId)
    {
        var isEmailSent = await _authService.ResendEmailVerificationCode(userId);
        if(!isEmailSent)
            return BadRequest("Could not resend verification code.");

        return Ok("Sent verification code");
    }
}