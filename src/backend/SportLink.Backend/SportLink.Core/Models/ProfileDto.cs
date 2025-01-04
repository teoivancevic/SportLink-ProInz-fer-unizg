//using SportLink.API.Data.Entities;
namespace SportLink.Core.Models;
public class ProfileDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string Location { get; set; }
    public int OwnerId { get; set; }

    //public virtual ICollection<SportLink.API.Data.Entities.SocialNetwork> SocialNetworks { get; set; }
}