namespace SportLink.Core.Handlers;

public interface IAuthHandler
{
    string CreateToken(string email, string userId, string firstName, string lastName, string roleName, string jwtKey);
}