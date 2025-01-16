using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class Review : BaseEntity
{
    public int Rating { get; set; }
    public string Description { get; set; }
    public string? Response { get; set; }

    public int UserId { get; set; }
    public int OrganizationId { get; set; }
    
    public virtual Organization Organization { get; set; }
    public virtual User User { get; set; }
}

public class ReviewConfigurationBuilder : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable(nameof(Review));

        // Composite key
        builder.HasKey(r => new { r.UserId, r.OrganizationId });
        builder.Property(r => r.Rating)
            .IsRequired();
        builder.Property(r => r.Description)
            .IsRequired();
        builder.Property(r => r.Response)
            .IsRequired(false); // Response is optional
            
        builder.Property(x => x.CreatedAt)
            .IsRequired();
        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(r => r.User)
            .WithMany(u => u.Reviews) 
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade); 

        builder.HasOne(r => r.Organization)
            .WithMany(o => o.Reviews) 
            .HasForeignKey(r => r.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}