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

    public async Task<UserDto> RegisterUser(RegisterUserDto registerUserDto, RolesEnum role)
    {
        var userDto = await CreateUnverifiedUser(registerUserDto, role);
        
        string otp6DigitCode = await _otpCodeService.GenerateOTP(userDto.Id, OTPCodeTypeEnum.EmailVerification, 6);
        // TODO handle ako null il nesto?

        await _emailService.SendVerificationEmailAsync(userDto.Email, otp6DigitCode);
        
        // _logger.LogInformation($"User {userDto.Id} OTP Code is: {otp6DigitCode}");
        
        return userDto;
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
    
    public async Task<UserDto> GetUserById(int id)
    {
        var user = await _context.Users.Where(x => x.Id == id).FirstOrDefaultAsync();
        var userDto = _mapper.Map<UserDto>(user);
        
        return userDto;
    }

    public async Task<UserDto> GetUserByEmail(string email)
    {
        var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
        var userDto = _mapper.Map<UserDto>(user);
        
        return userDto;
    }

    public async Task<List<UserDto>> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        var usersDto = _mapper.Map<List<UserDto>>(users);
        return usersDto;
    }

    public async Task<UserDto> CreateUnverifiedUser(RegisterUserDto createUserDto, RolesEnum role)
    {
        var userEntity = _mapper.Map<Data.Entities.User>(createUserDto);
        userEntity.Id = 0;
        PasswordHelper.CreatePasswordHash(createUserDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
        userEntity.PasswordHash = passwordHash;
        userEntity.PasswordSalt = passwordSalt;
        
        userEntity.RoleId = (int) RolesEnum.User;
        
        _context.Users.Add(userEntity);
        await _context.SaveChangesAsync();
        
        var userDto = _mapper.Map<UserDto>(userEntity);
        return userDto;
    }
}