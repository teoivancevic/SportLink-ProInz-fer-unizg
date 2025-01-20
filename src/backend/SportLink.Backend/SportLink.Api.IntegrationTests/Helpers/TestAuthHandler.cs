using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SportLink.Api.IntegrationTests.Helpers;

public static class TestAuthHandler
{
    private const string TestJwtKey = "D+UfSts07473vsXOBFM3WK4TJBVUHujg60EKmQ0QzjlFddS5VU5asyv+cK5K1OycX1Q3OSVt80knDbBqrgWaDQ==";

    public static string GenerateTestToken(string userId, string email, string role, string firstName, string lastName)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(ClaimTypes.GivenName, firstName),
            new Claim(ClaimTypes.Surname, lastName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestJwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}