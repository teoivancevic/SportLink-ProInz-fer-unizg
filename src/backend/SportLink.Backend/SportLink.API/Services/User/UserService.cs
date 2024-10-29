using AutoMapper;
using Microsoft.VisualBasic;
using SportLink.API.Data;
using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public class UserService : IUserService
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    public UserService(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task<UserDto> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        var userDto = _mapper.Map<UserDto>(user);
        
        return userDto;
        //throw new NotImplementedException();
        // var user = await _context.Users.FindAsync(id);
        // var userDto = _mapper.Map<UserDto>(user);
        //
        // return userDto;
    }
}