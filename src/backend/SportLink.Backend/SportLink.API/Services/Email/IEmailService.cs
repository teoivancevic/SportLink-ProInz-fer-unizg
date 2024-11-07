using SportLink.Core.Models;

namespace SportLink.API.Services.Email;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string to, string otpCode);
    Task SendRejectionEmailAsync(OrganizationDto organization, string reason);
    Task SendCreationEmailAsync(OrganizationDto organization);
    Task SendApprovalEmailAsync(string to);
}