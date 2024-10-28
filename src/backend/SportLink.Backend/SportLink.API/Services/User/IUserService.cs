using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public interface IUserService
{
    Task<UserDto> GetUser(int id);

}