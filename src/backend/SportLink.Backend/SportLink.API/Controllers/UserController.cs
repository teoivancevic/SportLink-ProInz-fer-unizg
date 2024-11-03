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
    
    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult<UserDto>> GetUsers(int id)
    {
        var user = await _userService.GetUser(id);
        if (user is null)
            return NotFound("User not found");
        
        return Ok(user);
    }

    [HttpGet]
    // [Authorize]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsers();
        return Ok(users);
    }
}