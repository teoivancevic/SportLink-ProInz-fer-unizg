using SportLink.Core.Models;

namespace SportLink.API.Services.Email;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string to, string otpCode);
    
    Task SendRejectionEmailAsync(OrganizationDto organization, string reason, string ownerUserEmail);
    Task SendCreationEmailAsync(OrganizationDto organization, string ownerUserEmail);
    Task SendApprovalEmailAsync(string ownerUserEmail);
}