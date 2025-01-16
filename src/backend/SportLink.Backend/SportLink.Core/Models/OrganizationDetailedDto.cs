namespace SportLink.Core.Models;
public class OrganizationDetailedDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string Location { get; set; }
    public UserDto Owner { get; set; }
    public List<SocialNetworkDto> SocialNetworks { get; set; }
    public double Rating { get; set; }
}