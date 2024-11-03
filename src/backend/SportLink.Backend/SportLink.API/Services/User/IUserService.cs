using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public interface IUserService
{
    Task<UserDto> RegisterUser(RegisterUserDto registerUserDto); // TODO sve ovo ide u auth serivce
    Task<UserDto> GetUser(int id);
    Task<List<UserDto>> GetAllUsers();
    Task<bool> VerifyUserEmail(int userId, string code);


}