using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class WorkTime : BaseEntity
{ 
    public int Id { get; set; }
    public int SportsObjectId { get; set; }
    public DayOfWeek DayOfWeek { get; set; } // Enum for days of the week
    public TimeSpan OpenFrom { get; set; }
    public TimeSpan OpenTo { get; set; }

    public virtual SportsObject SportsObject { get; set; }

}

public class WorkTimeConfigurationBuilder : IEntityTypeConfiguration<WorkTime>
{
    public void Configure(EntityTypeBuilder<WorkTime> builder)
    {
        builder.ToTable(nameof(WorkTime));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.DayOfWeek)
            .IsRequired();

        builder.Property(x => x.OpenFrom)
            .IsRequired();

        builder.Property(x => x.OpenTo)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        builder.HasOne(x => x.SportsObject)
            .WithMany(so => so.WorkTimes)
            .HasForeignKey(x => x.SportsObjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}