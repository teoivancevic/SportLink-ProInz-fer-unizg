using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
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

    [HttpGet("externalLogin/{provider}")]
    public IActionResult ExternalLogin(string provider = "Google")
    {
        var redirectUrl = Url.Action("ExternalLoginCallback", "Auth");
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
        return new ChallengeResult(provider, properties);
    }

    [HttpGet("externalLoginCallback")]
    public async Task<IActionResult> ExternalLoginCallback()
    {
        var claims = HttpContext.User.Claims;
        var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var externalUserId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var dbUser = await _userService.GetUserByEmail(email!);

        if (email == null || externalUserId == null)
        {
            return BadRequest("Sign in with Google failed.");
        }

        var firstName = claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value ?? "Unknown";
        var lastName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value ?? "Unknown";
        var roleName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ?? "User";

        var user = await _userService.GetUserByEmail(email);
        if (user is null)
        {
            var registerUser = await _userService.CreateExternalUser(email, externalUserId, firstName, lastName, roleName);

            if (registerUser is null)
            {
                return BadRequest("Registration via Google failed.");
            }

            var newUserToken = _authHandler.CreateToken(registerUser.Email, registerUser.Id.ToString(), registerUser.FirstName, registerUser.LastName, Enum.GetName(typeof(RolesEnum), registerUser.RoleId), _configuration["Jwt:Key"]);
            var newUserFrontendUrl = _configuration["ExternalLogin:FrontendRedirectUrl"];
            return Redirect($"{newUserFrontendUrl}?token={newUserToken}");
        }
        else
        {
            if (user.ExternalUserSource != ExternalUserSourceEnum.Google)
            {
                return BadRequest("Sign in with Google failed.");
            }
            else
            {
                var role = Enum.GetName(typeof(RolesEnum), user!.RoleId);
                var token = _authHandler.CreateToken(user.Email, user.Id.ToString(), user.FirstName, user.LastName, role!, _configuration["Jwt:Key"]);

                //return Ok(new { Token = token });
                var frontendUrl = _configuration["ExternalLogin:FrontendRedirectUrl"];
                return Redirect($"{frontendUrl}?token={token}");
            }
        }
    }

    /// <summary>
    /// Resend OTP email verification code
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpPut, AllowAnonymous]
    [Route("resendOTP")]
    public async Task<ActionResult> ResendOTPCode(int userId)
    {
        var isEmailSent = await _authService.ResendEmailVerificationCode(userId);
        if (!isEmailSent)
            return BadRequest("Could not resend verification code.");

        return Ok("Sent verification code");
    }
}