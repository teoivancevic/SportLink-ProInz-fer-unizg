using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class CourtBooking : BaseEntity
{
    public int Id { get; set; }
    //prebaceno u CourtPricing
    // public TimeSpan TimeFrom { get; set; }
    // public TimeSpan TimeTo { get; set; }
    // public decimal HourlyPrice { get; set; }
    public int SportId { get; set; }
    //ako zelimo pratit koliko ima terena za taj sport (mozda nepotrebno posto nemamo rezervacije)
    public int AvailableCourts { get; set; } 
    public int SportsObjectId { get; set; }
    
    public virtual Sport Sport { get; set; }
    public virtual ICollection<CourtPricing> CourtPricings { get; set; }
    public virtual SportsObject SportsObject { get; set; }
}

public class CourtBookingConfigurationBuilder : IEntityTypeConfiguration<CourtBooking>
{
    public void Configure(EntityTypeBuilder<CourtBooking> builder)
    {
        builder.ToTable(nameof(CourtBooking));
        builder.HasKey(x => x.Id);
        
        // builder.Property(x => x.TimeFrom)
        //     .IsRequired();
        // builder.Property(x => x.TimeTo)
        //     .IsRequired();
        // builder.Property(x => x.HourlyPrice)
        //     .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        builder.Property(x => x.AvailableCourts)
            .IsRequired();
        
        builder.HasOne(x => x.Sport)
            .WithMany(s => s.CourtBookings)
            .HasForeignKey(x => x.SportId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.SportsObject)
            .WithMany(o => o.CourtBookings)
            .HasForeignKey(x => x.SportsObjectId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

