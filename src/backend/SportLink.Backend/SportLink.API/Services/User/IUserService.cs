using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public interface IUserService
{


    Task<UserDto> GetUserById(int id);
    Task<UserDto> GetUserByEmail(string email);
    Task<List<UserDto>> GetAllUsers();


    Task<UserDto> CreateUnverifiedUser(RegisterUserDto createUserDto, RolesEnum role);
    Task<UserDto> CreateExternalUser(string email, string externalId, string firstName, string lastName, string roleName);
}