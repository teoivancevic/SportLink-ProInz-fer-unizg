using System.Collections;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

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
    //public bool IsVerified { get; set; }
    public VerificationStatusEnum VerificationStatus { get; set; }
    public string? RejectionResponse { get; set; }
    
    public virtual User Owner { get; set; }
    
    public virtual ICollection<Review> Reviews { get; set; }
    public virtual ICollection<SocialNetwork> SocialNetworks { get; set; }
    public virtual ICollection<Sport> Sports { get; set; }
    public virtual ICollection<TrainingGroup> TrainingGroups { get; set; }
    public virtual ICollection<CourtBooking> CourtBookings { get; set; }
    public virtual ICollection<Tournament> Tournaments { get; set; }
}

public class OrganizationConfigurationBuilder : IEntityTypeConfiguration<Organization>
{
    private readonly EnumToStringConverter<VerificationStatusEnum> _converter = new EnumToStringConverter<VerificationStatusEnum>();
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

        builder.Property(x => x.VerificationStatus)
            .HasDefaultValue(VerificationStatusEnum.Unverified)
            .IsRequired()
            .HasConversion(_converter);
        builder.Property(x => x.RejectionResponse)
            .IsRequired(false);
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        
        builder.HasOne(x => x.Owner)
            .WithMany(u => u.Organizations)
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasMany(x => x.Sports)
            .WithMany(s => s.Organizations) // Assuming Sport entity has Organizations collection
            .UsingEntity<Dictionary<string, object>>(
                "OrganizationSport", // Join table name
                j => j.HasOne<Sport>().WithMany().HasForeignKey("SportId"),
                j => j.HasOne<Organization>().WithMany().HasForeignKey("OrganizationId")
            );

    }
}