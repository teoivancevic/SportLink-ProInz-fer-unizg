using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class OTPCode
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Code { get; set; }
    public OTPCodeTypeEnum Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
    
    public virtual User User { get; set; }
}

public class OTPCodeConfigurationBuilder : IEntityTypeConfiguration<OTPCode>
{
    public void Configure(EntityTypeBuilder<OTPCode> builder)
    {
        builder.ToTable(nameof(OTPCode));
        builder.HasKey(x => x.Id);
    
        builder.Property(x => x.Code)
            .IsRequired();
        builder.Property(x => x.Type)
            .IsRequired();
        builder.Property(x => x.UserId)
            .IsRequired();
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.ExpiresAt)
            .IsRequired();
        builder.Property(x => x.IsUsed)
            .HasDefaultValue(false)
            .IsRequired();
        
    }
}

public class CopyOfOTPCodeConfigurationBuilder : IEntityTypeConfiguration<OTPCode>
{
    public void Configure(EntityTypeBuilder<OTPCode> builder)
    {
        builder.ToTable(nameof(OTPCode));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Code)
            .IsRequired();
        builder.Property(x => x.Type)
            .IsRequired();
        builder.Property(x => x.UserId)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.ExpiresAt)
            .IsRequired();
        builder.Property(x => x.IsUsed)
            .HasDefaultValue(false)
            .IsRequired();

    }
}
