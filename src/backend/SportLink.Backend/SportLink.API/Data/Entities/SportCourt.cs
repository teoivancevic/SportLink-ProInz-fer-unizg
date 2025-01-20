using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class SportCourt : BaseEntity
{
    public int Id { get; set; }
    public int SportId { get; set; }
    //ako zelimo pratit koliko ima terena za taj sport (mozda nepotrebno posto nemamo rezervacije)
    public int AvailableCourts { get; set; }
    public int SportsObjectId { get; set; }
    //public string CurrencyISO { get; set; }
    public decimal minHourlyPrice { get; set; }
    public decimal maxHourlyPrice { get; set; }

    public virtual Sport Sport { get; set; }
    //public virtual ICollection<CourtPricing> CourtPricings { get; set; }
    public virtual SportsObject SportsObject { get; set; }
}

public class SportCourtConfigurationBuilder : IEntityTypeConfiguration<SportCourt>
{
    public void Configure(EntityTypeBuilder<SportCourt> builder)
    {
        builder.ToTable(nameof(SportCourt));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.minHourlyPrice)
            .IsRequired();
        builder.Property(x => x.maxHourlyPrice)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        builder.Property(x => x.AvailableCourts)
            .IsRequired();

        builder.HasOne(x => x.Sport)
            .WithMany(s => s.SportCourts)
            .HasForeignKey(x => x.SportId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.SportsObject)
            .WithMany(o => o.SportCourts)
            .HasForeignKey(x => x.SportsObjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

