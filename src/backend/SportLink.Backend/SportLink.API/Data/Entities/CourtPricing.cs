using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class CourtPricing : BaseEntity
{
    public int Id { get; set; }
    public int CourtBookingId { get; set; }
    public DayOfWeek? DayOfWeek { get; set; } // Nullable for "all days"
    public TimeSpan TimeFrom { get; set; }
    public TimeSpan TimeTo { get; set; }
    public decimal HourlyPrice { get; set; }

    public virtual CourtBooking CourtBooking { get; set; }
}

public class CourtPricingConfigurationBuilder : IEntityTypeConfiguration<CourtPricing>
{
    public void Configure(EntityTypeBuilder<CourtPricing> builder)
    {
        builder.ToTable(nameof(CourtPricing));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.TimeFrom)
            .IsRequired();

        builder.Property(x => x.TimeTo)
            .IsRequired();

        builder.Property(x => x.HourlyPrice)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(x => x.DayOfWeek)
            .IsRequired(false); // Nullable to allow pricing for "all days"

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        builder.HasOne(cp => cp.CourtBooking)
            .WithMany(cb => cb.CourtPricings) 
            .HasForeignKey(cp => cp.CourtBookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}