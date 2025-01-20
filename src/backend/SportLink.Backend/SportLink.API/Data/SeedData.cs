using Microsoft.EntityFrameworkCore;
using SportLink.API.Data.Entities;
using SportLink.Core.Enums;

namespace SportLink.API.Data;

public class SeedData
{
    public static void CreateData(ModelBuilder builder)
    {
        // Seed roles
        builder.Entity<Role>().HasData(new Role[]
        {
            new Role
            {
                Id = (int) RolesEnum.AppAdmin,
                Name = RolesEnum.AppAdmin.ToString()
            },
            new Role
            {
                Id = (int) RolesEnum.OrganizationOwner,
                Name = RolesEnum.OrganizationOwner.ToString()
            },
            new Role
            {
                Id = (int) RolesEnum.User,
                Name = RolesEnum.User.ToString()
            }
        });
        
        builder.Entity<Sport>().HasData(new Sport[]
        {
            new Sport { Id = 1, Name = "Nogomet" },            // Football
            new Sport { Id = 2, Name = "Košarka" },            // Basketball
            new Sport { Id = 3, Name = "Tenis" },            // Volleyball
            new Sport { Id = 4, Name = "Odbojka" },            // Tennis
            new Sport { Id = 5, Name = "Stolni tenis" },       // Table Tennis
            new Sport { Id = 6, Name = "Rukomet" },            // Handball
            new Sport { Id = 7, Name = "Badminton" },          // Badminton
            new Sport { Id = 8, Name = "Plivanje" },           // Swimming
            new Sport { Id = 9, Name = "Atletika" },           // Athletics
            new Sport { Id = 10, Name = "Biciklizam" },        // Cycling
            new Sport { Id = 11, Name = "Mali nogomet" },      // Futsal
            new Sport { Id = 12, Name = "Gimnastika" },        // Gymnastics
            new Sport { Id = 13, Name = "Džudo" },             // Judo
            new Sport { Id = 14, Name = "Hrvanje" },           // Wrestling
            new Sport { Id = 15, Name = "Hokej na travi" }     // Field Hockey
        });
    }
}