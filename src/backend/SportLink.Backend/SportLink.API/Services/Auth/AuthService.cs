using AutoMapper;
using SportLink.API.Data;
using SportLink.API.Services.Email;
using SportLink.API.Services.OTPCode;
using SportLink.API.Services.User;
using SportLink.Core.Enums;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Services.Auth;

public class AuthService : IAuthService
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService> _logger;
    
    private readonly IOTPCodeService _otpCodeService;
    private readonly IEmailService _emailService;
    private readonly IUserService _userService;
    
    public AuthService(DataContext context, IMapper mapper, ILogger<UserService> logger, 
        IOTPCodeService otpCodeService, IEmailService emailService, IUserService userService)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;

        _otpCodeService = otpCodeService;
        _emailService = emailService;
        _userService = userService;
    }
    
    public async Task<UserDto> RegisterUser(RegisterUserDto registerUserDto, RolesEnum role)
    {
        var userDto = await _userService.CreateUnverifiedUser(registerUserDto, role);
        
        string otp6DigitCode = await _otpCodeService.GenerateOTP(userDto.Id, OTPCodeTypeEnum.EmailVerification, 6);
        if (otp6DigitCode is null || otp6DigitCode == "")
        {
            return null;
        }

        await _emailService.SendVerificationEmailAsync(userDto.Email, otp6DigitCode);
        
        // _logger.LogInformation($"User {userDto.Id} OTP Code is: {otp6DigitCode}");
        
        return userDto;
    }
    public async Task<bool> VerifyUserEmail(int userId, string code)
    {
        var result = await _otpCodeService.ValidateOTP(userId, OTPCodeTypeEnum.EmailVerification, code);
        if (!result)
            return false;
            
        var user = await _context.Users.FindAsync(userId);
        if (user is null) return false;
        user.IsEmailVerified = true;
        await _context.SaveChangesAsync();
        
        return result;
    }
    public async Task<bool> LoginCheckCredentials(UserDto userDto, string password)
    {
        var userEntity = await _context.Users.FindAsync(userDto.Id);
        if (userEntity is not null && PasswordHelper.VerifyPasswordHash(password, userEntity.PasswordHash, userEntity.PasswordSalt))
        {
            userEntity.LastLoginAt = DateTime.UtcNow;
            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();
            
            return true;
        }

        return false;
    }

    public async Task<bool> ResendEmailVerificationCode(int userId)
    {
        var userEntity = await _context.Users.FindAsync(userId);
        if (userEntity is not null && !userEntity.IsEmailVerified)
        {
            string? otp6DigitCode = await _otpCodeService.GenerateOTP(userEntity.Id, OTPCodeTypeEnum.EmailVerification, 6);
            if (otp6DigitCode is null || otp6DigitCode == "")
            {
                return false;
            }

            await _emailService.SendVerificationEmailAsync(userEntity.Email, otp6DigitCode);
            
            return true;
        }

        return false;
    }

    public async Task ForgotPassword(string email)
    {
        throw new NotImplementedException();
    }
    
    
}