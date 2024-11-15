using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SportLink.API.Data.Entities;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }

    public virtual ICollection<User> Users { get; set; }
}

public class RoleConfigurationBuilder : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable(nameof(Role));
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name)
            .IsRequired();
    }
}