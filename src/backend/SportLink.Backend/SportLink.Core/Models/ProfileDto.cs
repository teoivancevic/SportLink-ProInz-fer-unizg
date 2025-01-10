namespace SportLink.Core.Models;
public class ProfileDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string Location { get; set; }
    public List<SocialNetworkDto> SocialNetworks { get; set; }
    //public string Sport { get; set; }   // ili ne, nije tako u bazi
    public double Rating { get; set; }
}