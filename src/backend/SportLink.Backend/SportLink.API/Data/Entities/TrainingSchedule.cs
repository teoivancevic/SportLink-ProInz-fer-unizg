using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class TrainingSchedule : BaseEntity
{
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int TrainingGroupId { get; set; }
    
    public virtual TrainingGroup TrainingGroup { get; set; }
}

public class TrainingScheduleConfigurationBuilder : IEntityTypeConfiguration<TrainingSchedule>
{
    public void Configure(EntityTypeBuilder<TrainingSchedule> builder)
    {
        builder.ToTable(nameof(TrainingSchedule));
        builder.HasKey(t => new {t.TrainingGroupId, t.DayOfWeek, t.StartTime});
        builder.Property(t => t.EndTime)
            .IsRequired();
        
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        
        builder.HasOne(t => t.TrainingGroup)
            .WithMany(x => x.TrainingSchedules)
            .HasForeignKey(t => t.TrainingGroupId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}