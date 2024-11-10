using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data.Entities;

namespace SportLink.API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<OTPCode> OTPCodes { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<SocialNetwork> SocialNetworks { get; set; }
    public DbSet<Sport> Sports { get; set; }
    public DbSet<TrainingGroup> TrainingGroups { get; set; }
    public DbSet<CourtBooking> CourtBookings { get; set; }
    public DbSet<Tournament> Tournaments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        
        SeedData.CreateData(modelBuilder);
    }
    
    public override int SaveChanges()
    {
        AddTimestamps();
        return base.SaveChanges();
    }

    public async Task<int> SaveChangesAsync()
    {
        AddTimestamps();
        return await base.SaveChangesAsync();
    }

    private void AddTimestamps()
    {
        var entities = ChangeTracker.Entries()
            .Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

        foreach (var entity in entities)
        {
            var now = DateTime.UtcNow; // current datetime

            if (entity.State == EntityState.Added)
            {
                ((BaseEntity)entity.Entity).CreatedAt = now;
            }
            ((BaseEntity)entity.Entity).UpdatedAt = now;
        }
    }
}