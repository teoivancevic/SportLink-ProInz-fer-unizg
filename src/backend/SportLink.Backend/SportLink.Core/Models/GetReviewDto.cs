namespace SportLink.Core.Models;

public class GetReviewDto
{
    public int UserId { get; set; }
    public int Rating { get; set; }
    public string Description { get; set; }
    public string? Response { get; set; }
    public string UserFirstName { get; set; }
    public string UserLastName { get; set; }
    public string OrganizationName { get; set; } //da se moze prikazat ime iznad responsa
    public int OrganizationId { get; set; }
}