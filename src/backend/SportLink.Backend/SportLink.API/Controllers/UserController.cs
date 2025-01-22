using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.User;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Return single user (Admin only)
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet, Authorize(Roles = "AppAdmin", Policy = "jwt_policy")]
    [Route("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserById(id);
        if (user is null)
            return NotFound("User not found");

        return Ok(user);
    }

    /// <summary>
    /// Return all users (Admin only)
    /// </summary>
    /// <returns></returns>
    [HttpGet, Authorize(Roles = "AppAdmin", Policy = "jwt_policy")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsers();
        return Ok(users);
    }
}