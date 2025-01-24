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
    public UserService(DataContext context, IMapper mapper, ILogger<UserService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<UserDetailedDto> GetUserById(int id)
    {
        var user = await _context.Users.Where(x => x.Id == id).FirstOrDefaultAsync();
        var userDto = _mapper.Map<UserDetailedDto>(user);

        return userDto;
    }

    public async Task<UserDetailedDto> GetUserByEmail(string email)
    {
        var user = await _context.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
        var userDto = _mapper.Map<UserDetailedDto>(user);

        return userDto;
    }

    public async Task<List<UserDetailedDto>> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        var usersDto = _mapper.Map<List<UserDetailedDto>>(users);
        return usersDto;
    }

    public async Task<UserDetailedDto> CreateUnverifiedUser(RegisterUserDto createUserDto, RolesEnum role)
    {
        var userEntity = _mapper.Map<Data.Entities.User>(createUserDto);
        userEntity.Id = 0;
        PasswordHelper.CreatePasswordHash(createUserDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
        userEntity.PasswordHash = passwordHash;
        userEntity.PasswordSalt = passwordSalt;

        userEntity.RoleId = (int)RolesEnum.User;

        _context.Users.Add(userEntity);
        await _context.SaveChangesAsync();

        var userDto = _mapper.Map<UserDetailedDto>(userEntity);
        return userDto;
    }

    public async Task<UserDetailedDto> UpdateUser(int userId, RegisterUserDto updateUserDto, RolesEnum role)
    {
        var userEntity = await _context.Users.FindAsync(userId);
        if (userEntity is null)
            return null!;

        userEntity.FirstName = updateUserDto.FirstName;
        userEntity.LastName = updateUserDto.LastName;

        if (updateUserDto.Password != null)
        {
            PasswordHelper.CreatePasswordHash(updateUserDto.Password, out byte[] passwordHash, out byte[] passwordSalt);
            userEntity.PasswordHash = passwordHash;
            userEntity.PasswordSalt = passwordSalt;
        }

        _context.Users.Update(userEntity);
        await _context.SaveChangesAsync();

        var userDto = _mapper.Map<UserDetailedDto>(userEntity);
        return userDto;
    }

    public async Task<UserDetailedDto> CreateExternalUser(string email, string externalId, string firstName, string lastName, string roleName)
    {
        int roleId = 0;
        if (Enum.TryParse(roleName, out RolesEnum role))
        {
            roleId = (int)role;
        }
        var userEntity = new Data.Entities.User
        {
            Id = 0,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            RoleId = roleId,
            PasswordHash = null!,
            PasswordSalt = null!,
            IsEmailVerified = true,
            ExternalUserSource = ExternalUserSourceEnum.Google,
            ExternalUserId = externalId
        };

        _context.Users.Add(userEntity);
        await _context.SaveChangesAsync();

        var userDto = _mapper.Map<UserDetailedDto>(userEntity);
        return userDto;
    }
}