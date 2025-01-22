using SportLink.Core.Enums;

namespace SportLink.Core.Models;

public class OrganizationForAdminDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string Location { get; set; }
    public VerificationStatusEnum VerificationStatus { get; set; }
}