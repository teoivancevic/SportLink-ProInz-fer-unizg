using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class Organization : BaseEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string Location { get; set; }
    public int OwnerId { get; set; }
    public bool IsVerified { get; set; }
    
    public virtual User Owner { get; set; }
}

public class UserConfigurationBuilder : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.ToTable(nameof(Organization));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name)
            .IsRequired();
        builder.Property(x => x.Description)
            .IsRequired();
        builder.Property(x => x.ContactEmail)
            .IsRequired();
        builder.Property(x => x.ContactPhoneNumber)
            .IsRequired();
        builder.Property(x => x.Location)
            .IsRequired();
        builder.Property(x => x.OwnerId)
            .IsRequired();
        
        builder.Property(x => x.IsVerified)
            .HasDefaultValue(false)
            .IsRequired();
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        
        builder.HasOne(x => x.Owner)
            .WithMany(u => u.Organizations)
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}