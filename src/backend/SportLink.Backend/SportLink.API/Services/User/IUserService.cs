using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public interface IUserService
{


    Task<UserDetailedDto> GetUserById(int id);
    Task<UserDetailedDto> GetUserByEmail(string email);
    Task<List<UserDetailedDto>> GetAllUsers();
    Task<UserDetailedDto> CreateUnverifiedUser(RegisterUserDto createUserDto, RolesEnum role);
    Task<UserDetailedDto> CreateExternalUser(string email, string externalId, string firstName, string lastName, string roleName);
}