using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class Tournament : BaseEntity
{
    public int Id { get; set; }
    public string Description { get; set; }
    public DateTime TimeFrom { get; set; }
    public DateTime TimeTo { get; set; }
    public decimal EntryFee { get; set; }
    
    public int OrganizationId { get; set; }
    public int SportId { get; set; }
    
    public virtual Organization Organization { get; set; }
    public virtual Sport Sport { get; set; }
}

public class TournamentConfigurationBuilder : IEntityTypeConfiguration<Tournament>
{
    public void Configure(EntityTypeBuilder<Tournament> builder)
    {
        builder.ToTable(nameof(Tournament));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.TimeFrom)
            .IsRequired();
        builder.Property(x => x.TimeTo)
            .IsRequired();
        builder.Property(x => x.EntryFee)
            .IsRequired();
        builder.Property(x => x.Description)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();
        
        builder.HasOne(x => x.Sport)
            .WithMany(s => s.Tournaments)
            .HasForeignKey(x => x.SportId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.Organization)
            .WithMany(o => o.Tournaments)
            .HasForeignKey(x => x.OrganizationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}