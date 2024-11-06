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
    }
}