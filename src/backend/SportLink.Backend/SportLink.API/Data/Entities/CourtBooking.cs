using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class CourtBooking : BaseEntity
{
    public int Id { get; set; }
    public TimeSpan TimeFrom { get; set; }
    public TimeSpan TimeTo { get; set; }
    public decimal HourlyPrice { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    public int SportId { get; set; }
    public int OrganizationId { get; set; }
    
    public virtual Sport Sport { get; set; }
    public virtual Organization Organization { get; set; }
}

public class CourtBookingConfigurationBuilder : IEntityTypeConfiguration<CourtBooking>
{
    public void Configure(EntityTypeBuilder<CourtBooking> builder)
    {
        builder.ToTable(nameof(CourtBooking));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.TimeFrom)
            .IsRequired();
        builder.Property(x => x.TimeTo)
            .IsRequired();
        builder.Property(x => x.HourlyPrice)
            .IsRequired();
        builder.Property(x => x.Description)
            .IsRequired();
        
        builder.Property(x => x.Location)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        
        builder.HasOne(x => x.Sport)
            .WithMany(s => s.CourtBookings)
            .HasForeignKey(x => x.SportId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.Organization)
            .WithMany(o => o.CourtBookings)
            .HasForeignKey(x => x.OrganizationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

