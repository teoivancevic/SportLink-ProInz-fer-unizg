using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SportLink.Core.Enums;

namespace SportLink.API.Data.Entities;

public class TrainingGroup : BaseEntity
{
    public int Id { get; set; }
    public int AgeFrom { get; set; }
    public int AgeTo { get; set; }
    public SexEnum Sex { get; set; }
    public int MonthlyPrice { get; set; }
    public string Description { get; set; }
    public int OrganizationId { get; set; }
    public int SportId { get; set; }
    
    public virtual Sport Sport { get; set; }
    public virtual Organization Organization { get; set; }
    public virtual ICollection<TrainingSchedule> TrainingSchedules { get; set; }
}

public class TrainingGroupConfigurationBuilder : IEntityTypeConfiguration<TrainingGroup>
{
    private readonly EnumToStringConverter<SexEnum> _converter = new EnumToStringConverter<SexEnum>();
    public void Configure(EntityTypeBuilder<TrainingGroup> builder)
    {
        builder.ToTable(nameof(TrainingGroup));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.AgeFrom)
            .IsRequired();
        builder.Property(x => x.AgeTo)
            .IsRequired();
        builder.Property(x => x.Sex)
            .IsRequired()
            .HasConversion(_converter);
        builder.Property(x => x.MonthlyPrice)
            .IsRequired();
        builder.Property(x => x.Description)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        
        builder.HasOne(x => x.Sport)
            .WithMany(s => s.TrainingGroups)
            .HasForeignKey(x => x.SportId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Organization)
            .WithMany(o => o.TrainingGroups)
            .HasForeignKey(x => x.OrganizationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}