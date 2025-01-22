using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.Core.Enums;
using SportLink.Core.Helpers;

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
        db.Organizations.AddRange(GetSeedingOrganizations());
        db.SaveChanges();
        db.SportsObjects.AddRange(GetSeedingSportsObjects());
        db.SaveChanges();

    }

    public static void ReinitializeDbForTests(DataContext db)
    {
        db.Users.RemoveRange(db.Users);
        db.Organizations.RemoveRange(db.Organizations);
        db.SportsObjects.RemoveRange(db.SportsObjects);
        InitializeDbForTests(db);
    }

    public static List<User> GetSeedingUsers()
    {
        PasswordHelper.CreatePasswordHash("Test1234!", out byte[] passwordHash, out byte[] passwordSalt);
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
            },
            new User
            {
                Id = 3,
                FirstName = "App",
                LastName = "Admin",
                Email = "app@example.com",
                RoleId = 1,
                IsEmailVerified = true,
                LastLoginAt = DateTime.UtcNow.AddDays(-1)
            },
            new User
            {
                Id = 4,
                FirstName = "Test",
                LastName = "Test",
                Email = "test@example.com",
                RoleId = 3,
                IsEmailVerified = true,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
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

    public static List<SportsObject> GetSeedingSportsObjects()
    {
                return new List<SportsObject>()
        {
            new SportsObject
            {
                Name = "Central Tennis Complex",
                Description = "Premier tennis facility with indoor and outdoor courts",
                Location = "123 Sports Avenue, City A",
                OrganizationId = 1,
                SportCourts = new List<SportCourt>
                {
                    new SportCourt
                    {
                        SportId = 1, // Assuming 1 is Tennis
                        SportsObjectId = 1,
                        AvailableCourts = 6,
                        minHourlyPrice = 25.00M,
                        maxHourlyPrice = 40.00M
                        
                    }
                },
                WorkTimes = new List<WorkTime>
                {
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Ponedjeljak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(7, 0),
                        OpenTo = new TimeOnly(22, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Utorak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(7, 0),
                        OpenTo = new TimeOnly(22, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Srijeda,
                        isWorking = true,
                        OpenFrom = new TimeOnly(7, 0),
                        OpenTo = new TimeOnly(22, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Četvrtak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(7, 0),
                        OpenTo = new TimeOnly(22, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Petak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(7, 0),
                        OpenTo = new TimeOnly(22, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Subota,
                        isWorking = true,
                        OpenFrom = new TimeOnly(8, 0),
                        OpenTo = new TimeOnly(20, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Nedjelja,
                        isWorking = true,
                        OpenFrom = new TimeOnly(8, 0),
                        OpenTo = new TimeOnly(20, 0)
                    }
                }
            },
            new SportsObject
            {
                Name = "MultiSport Arena",
                Description = "Modern sports complex featuring basketball and volleyball courts",
                Location = "456 Athletic Drive, City B",
                OrganizationId = 2,
                SportCourts = new List<SportCourt>
                {
                    new SportCourt
                    {
                        SportId = 2, // Assuming 2 is Basketball
                        AvailableCourts = 3,
                        minHourlyPrice = 30.00M,
                        maxHourlyPrice = 45.00M
                    },
                    new SportCourt
                    {
                        SportId = 3, // Assuming 3 is Volleyball
                        AvailableCourts = 2,
                        minHourlyPrice = 28.00M,
                        maxHourlyPrice = 40.00M
                    }
                },
                WorkTimes = new List<WorkTime>
                {
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Ponedjeljak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(6, 0),
                        OpenTo = new TimeOnly(23, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Utorak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(6, 0),
                        OpenTo = new TimeOnly(23, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Srijeda,
                        isWorking = true,
                        OpenFrom = new TimeOnly(6, 0),
                        OpenTo = new TimeOnly(23, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Četvrtak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(6, 0),
                        OpenTo = new TimeOnly(23, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Petak,
                        isWorking = true,
                        OpenFrom = new TimeOnly(6, 0),
                        OpenTo = new TimeOnly(23, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Subota,
                        isWorking = true,
                        OpenFrom = new TimeOnly(8, 0),
                        OpenTo = new TimeOnly(22, 0)
                    },
                    new WorkTime
                    {
                        DayOfWeek = DanUTjednuEnum.Nedjelja,
                        isWorking = true,
                        OpenFrom = new TimeOnly(8, 0),
                        OpenTo = new TimeOnly(22, 0)
                    }
                }
            }
        };
    }
}