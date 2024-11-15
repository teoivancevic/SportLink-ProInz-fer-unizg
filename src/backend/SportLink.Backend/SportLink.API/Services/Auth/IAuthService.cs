using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.Auth;

public interface IAuthService
{
    Task<UserDto> RegisterUser(RegisterUserDto registerUserDto, RolesEnum role); // TODO sve ovo ide u auth serivce
    Task<bool> VerifyUserEmail(int userId, string otpCode);
    Task<bool> LoginCheckCredentials(UserDto userDto, string password);
    
    Task<bool> ResendEmailVerificationCode(int userId);
    Task ForgotPassword(string email);
}