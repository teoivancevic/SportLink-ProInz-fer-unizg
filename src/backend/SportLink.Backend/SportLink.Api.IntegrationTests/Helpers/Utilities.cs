using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.Core.Enums;

namespace SportLink.Api.IntegrationTests.Helpers;

public class Utilities
{
    public static void InitializeDbForTests(DataContext db)
    {
        if (!db.Users.Any())
        {
            var users = GetSeedingUsers();
            db.Users.AddRange(users);
            db.SaveChanges();
        }
        // db.Organizations.AddRange(GetSeedingOrganizations());
        // db.SaveChanges();
        
    }

    public static void ReinitializeDbForTests(DataContext db)
    {
        db.Users.RemoveRange(db.Users);
        db.Organizations.RemoveRange(db.Organizations);
        InitializeDbForTests(db);
    }

    public static List<User> GetSeedingUsers()
    {
        return new List<User>()
        {
            new User
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                RoleId = 2,
                IsEmailVerified = true,
                LastLoginAt = DateTime.UtcNow.AddDays(-1)
            },
            new User
            {
                Id = 2,
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane@example.com",
                RoleId = 3,
                IsEmailVerified = true,
                LastLoginAt = DateTime.UtcNow.AddDays(-2)
            }
        };
    }

    public static List<Organization> GetSeedingOrganizations()
    {
        return new List<Organization>()
        {
            new Organization
            {
                //Id = 1,
                Name = "Sports Club A",
                Description = "A great sports club",
                ContactEmail = "contact@sportscluba.com",
                ContactPhoneNumber = "1234567890",
                Location = "City A",
                OwnerId = 1,
                VerificationStatus = VerificationStatusEnum.Accepted
            },
            new Organization
            {
                //Id = 2,
                Name = "Fitness Center B",
                Description = "Your local fitness center",
                ContactEmail = "info@fitnesscenterb.com",
                ContactPhoneNumber = "0987654321",
                Location = "City B",
                OwnerId = 1,
                VerificationStatus = VerificationStatusEnum.Accepted
            }
        };
    }
}