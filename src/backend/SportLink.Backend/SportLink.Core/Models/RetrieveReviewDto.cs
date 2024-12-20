namespace SportLink.Core.Models;

public class RetrieveReviewDto
{
    public int Rating { get; set; }
    public string Description { get; set; }
    public string? Response { get; set; }
    public string UserName { get; set; }
    public string OrganizationName { get; set; }
}