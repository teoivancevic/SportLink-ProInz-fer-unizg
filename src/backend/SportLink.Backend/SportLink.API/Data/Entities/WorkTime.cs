using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class WorkTime : BaseEntity
{ 
    public int Id { get; set; }
    public int SportsObjectId { get; set; }
    public List<DayOfWeek> DaysOfWeek { get; set; } 
    public TimeOnly OpenFrom { get; set; }
    public TimeOnly OpenTo { get; set; }   //npr. 8.30 je (8, 30)

    public virtual SportsObject SportsObject { get; set; }

}

public class WorkTimeConfigurationBuilder : IEntityTypeConfiguration<WorkTime>
{
    public void Configure(EntityTypeBuilder<WorkTime> builder)
    {
        builder.ToTable(nameof(WorkTime));
        builder.HasKey(x => x.Id);

        builder.Property(x => x.DaysOfWeek)
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