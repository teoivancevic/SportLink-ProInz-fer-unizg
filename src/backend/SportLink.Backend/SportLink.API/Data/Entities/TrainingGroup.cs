using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class TrainingGroup : BaseEntity
{
    public int Id { get; set; }
    public int AgeFrom { get; set; }
    public int AgeTo { get; set; }
    public int Sex { get; set; }
    public int MonthlyPrice { get; set; }
    public string Description { get; set; }
    public int SportId { get; set; }
    
    public virtual Sport Sport { get; set; }
}

public class TrainingGroupConfigurationBuilder : IEntityTypeConfiguration<TrainingGroup>
{
    public void Configure(EntityTypeBuilder<TrainingGroup> builder)
    {
        builder.ToTable(nameof(TrainingGroup));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.AgeFrom)
            .IsRequired();
        builder.Property(x => x.AgeTo)
            .IsRequired();
        builder.Property(x => x.Sex)
            .IsRequired();
        builder.Property(x => x.MonthlyPrice)
            .IsRequired();
        builder.Property(x => x.Description)
            .IsRequired();
        
        builder.HasOne(x => x.Sport)
            .WithMany(s => s.TrainingGroups)
            .HasForeignKey(x => x.SportId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}