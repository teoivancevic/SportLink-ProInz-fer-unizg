using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class Sport
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public virtual ICollection<Organization> Organizations { get; set; }
    public virtual ICollection<TrainingGroup> TrainingGroups { get; set; }
    public virtual ICollection<CourtBooking> CourtBookings { get; set; }
    public virtual ICollection<Tournament> Tournaments { get; set; }
}

public class SportConfigurationBuilder : IEntityTypeConfiguration<Sport>
{
    public void Configure(EntityTypeBuilder<Sport> builder)
    {
        builder.ToTable(nameof(Sport));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired();
    }
}