using SportLink.Core.Models;

namespace SportLink.API.Services.User;

public class UserService : IUserService
{
    public UserService()
    {
        
    }
    
    public async Task<UserDto> GetUser(int id)
    {
        throw new NotImplementedException();
        // var user = await _context.Users.FindAsync(id);
        // var userDto = _mapper.Map<UserDto>(user);
        //
        // return userDto;
    }
}