namespace SportLink.Core.Models;

public class SportObjectSearchDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Location { get; set; }
    public string OrganizationName { get; set; }
    public List<SportCourtDto> SportCourtDtos { get; set; }
}