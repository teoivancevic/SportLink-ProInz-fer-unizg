using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class SportsObject : BaseEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Location { get; set; }
    public int OrganizationId { get; set; }

    public virtual Organization Organization { get; set; }
    public virtual ICollection<SportCourt> SportCourts { get; set; }
    public virtual ICollection<WorkTime> WorkTimes { get; set; }
}

public class SportsObjectConfigurationBuilder : IEntityTypeConfiguration<SportsObject>
{
    public void Configure(EntityTypeBuilder<SportsObject> builder)
    {
        builder.ToTable(nameof(SportsObject));
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Name).HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Description)
            .IsRequired();

        builder.Property(x => x.Location)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        builder.HasOne(x => x.Organization)
            .WithMany(o => o.SportsObjects)
            .HasForeignKey(x => x.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}