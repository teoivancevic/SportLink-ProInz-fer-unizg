using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class User : BaseEntity
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public int RoleId { get; set; }
    
    
    public byte[]? PasswordHash { get; set; }
    public byte[]? PasswordSalt { get; set; }
    
    public DateTime LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsEmailVerified { get; set; }
    
    public ExternalUserSourceEnum? ExternalUserSource { get; set; }
    public string? ExternalUserId { get; set; }
    
    public virtual Role Role { get; set; }
    public virtual ICollection<OTPCode> OTPCodes { get; set; }
    public virtual ICollection<Organization> Organizations { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
}

public class UserConfigurationBuilder : IEntityTypeConfiguration<User>
{
    private readonly EnumToStringConverter<ExternalUserSourceEnum> _converter = new EnumToStringConverter<ExternalUserSourceEnum>();
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable(nameof(User));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.FirstName)
            .IsRequired();
        builder.Property(x => x.LastName)
            .IsRequired();
        
        builder.Property(x => x.Email)
            .IsRequired();
        builder.HasIndex(x => x.Email)
            .IsUnique();
        
        builder.Property(x => x.PasswordHash)
            .IsRequired(false);
        builder.Property(x => x.PasswordSalt)
            .IsRequired(false);
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.LastLoginAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        builder.Property(x => x.IsEmailVerified)
            .HasDefaultValue(false)
            .IsRequired();
        
        builder.Property(x => x.ExternalUserId)
            .IsRequired(false);
        builder.Property(x => x.ExternalUserSource)
            .HasConversion(_converter)
            .IsRequired(false);
        
        builder.HasOne(x => x.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(x => x.OTPCodes)
            .WithOne(r => r.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
