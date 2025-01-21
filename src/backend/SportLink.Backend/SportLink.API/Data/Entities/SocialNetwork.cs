using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class SocialNetwork : BaseEntity
{
    public SocialNetworkTypeEnum Type { get; set; }
    public string Link { get; set; }
    public string Username { get; set; }
    public int OrganizationId { get; set; }
    
    public virtual Organization Organization { get; set; }
    
}

public class SocialNetworkConfigurationBuilder : IEntityTypeConfiguration<SocialNetwork>
{
    private readonly EnumToStringConverter<SocialNetworkTypeEnum> _converter = new EnumToStringConverter<SocialNetworkTypeEnum>();
    public void Configure(EntityTypeBuilder<SocialNetwork> builder)
    {
        builder.ToTable(nameof(SocialNetwork));

        // Composite key
        builder.HasKey(r => new { r.Type, r.OrganizationId });
        builder.Property(r => r.Username)
            .IsRequired();
        builder.Property(r => r.Link)
            .IsRequired();
        builder.Property(r => r.Type)
            .HasConversion(_converter);
            
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(r => r.Organization)
            .WithMany(o => o.SocialNetworks) 
            .HasForeignKey(r => r.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class CopyOfSocialNetworkConfigurationBuilder : IEntityTypeConfiguration<SocialNetwork>
{
    private readonly EnumToStringConverter<SocialNetworkTypeEnum> _converter = new EnumToStringConverter<SocialNetworkTypeEnum>();
    public void Configure(EntityTypeBuilder<SocialNetwork> builder)
    {
        builder.ToTable(nameof(SocialNetwork));

        // Composite key
        builder.HasKey(r => new { r.Type, r.OrganizationId });
        builder.Property(r => r.Username)
            .IsRequired();
        builder.Property(r => r.Link)
            .IsRequired();
        builder.Property(r => r.Type)
            .HasConversion(_converter);

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(r => r.Organization)
            .WithMany(o => o.SocialNetworks)
            .HasForeignKey(r => r.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}