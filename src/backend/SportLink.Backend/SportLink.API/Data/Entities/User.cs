namespace SportLink.API.Data.Entities;

public class User : BaseEntity
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime LastLoginAt { get; set; }
    
    public virtual ICollection<Organization> Organizations { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
}

