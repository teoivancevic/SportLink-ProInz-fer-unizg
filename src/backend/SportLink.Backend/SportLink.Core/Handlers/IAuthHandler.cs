namespace SportLink.Core.Handlers;

public interface IAuthHandler
{
    string CreateToken(string username, string userId, string role, string accountId, string jwtKey);
}