using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using SportLink.API.Data;
using SportLink.API.Services.Email;
using SportLink.API.Services.OTPCode;
using SportLink.Core.Enums;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public class UserService : IUserService
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    
    private readonly ILogger<UserService> _logger;
    
    private readonly IOTPCodeService _otpCodeService;
    private readonly IEmailService _emailService;
    public UserService(DataContext context, IMapper mapper, IOTPCodeService otpCodeService, ILogger<UserService> logger, IEmailService emailService)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;

        _otpCodeService = otpCodeService;
        _emailService = emailService;
    }

    public async Task<UserDto> RegisterUser(RegisterUserDto registerUserDto)
    {
        var userEntity = _mapper.Map<Data.Entities.User>(registerUserDto);
        userEntity.Id = 0;
        PasswordHelper.CreatePasswordHash(registerUserDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
        userEntity.PasswordHash = passwordHash;
        userEntity.PasswordSalt = passwordSalt;
        
        userEntity.RoleId = (int) RolesEnum.User;
        
        // userEntity.IsEmailVerified = false;
        
        
        // userEntity.EmailVerificationToken = Guid.NewGuid(); // TODO PLACEHOLDER

        _context.Users.Add(userEntity);
        await _context.SaveChangesAsync();
        
        string otp6DigitCode = await _otpCodeService.GenerateOTP(userEntity.Id, OTPCodeTypeEnum.EmailVerification, 6);
        // TODO handle ako null il nekaj?

        // TODO send verification email with generated 6 digit code
        await _emailService.SendVerificationEmailAsync(userEntity.Email, otp6DigitCode);
        
        _logger.LogInformation($"User {userEntity.Id} OTP Code is: {otp6DigitCode}");
        
        var userDto = _mapper.Map<UserDto>(userEntity);
        return userDto;
    }

    // TODO MAKE create DB user only function

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
    
    public async Task<UserDto> GetUser(int id)
    {
        var user = await _context.Users.Where(x => x.Id == id).FirstOrDefaultAsync();
        var userDto = _mapper.Map<UserDto>(user);
        
        return userDto;
    }

    public async Task<List<UserDto>> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        var usersDto = _mapper.Map<List<UserDto>>(users);
        return usersDto;
    }
}