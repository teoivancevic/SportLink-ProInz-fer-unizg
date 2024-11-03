using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public interface IUserService
{
    Task<UserDto> RegisterUser(RegisterUserDto registerUserDto, RolesEnum role); // TODO sve ovo ide u auth serivce
    Task<bool> LoginCheckCredentials(UserDto userDto, string password);
    
    Task<UserDto> GetUserById(int id);
    Task<UserDto> GetUserByEmail(string email);
    Task<List<UserDto>> GetAllUsers();
    Task<bool> VerifyUserEmail(int userId, string code);

    Task<UserDto> CreateUnverifiedUser(RegisterUserDto createUserDto, RolesEnum role);




}