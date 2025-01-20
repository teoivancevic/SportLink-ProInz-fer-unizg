using SportLink.API.Services.Email;
using SportLink.Core.Models;

namespace SportLink.Api.IntegrationTests.Helpers;

public class NoOpEmailService : IEmailService
{
    public Task SendVerificationEmailAsync(string to, string otpCode)
    {
        return Task.CompletedTask;
    }

    public Task SendRejectionEmailAsync(OrganizationDto organization, string reason, string ownerUserEmail)
    {
        return Task.CompletedTask;
    }

    public Task SendCreationEmailAsync(OrganizationDto organization, string ownerUserEmail)
    {
        return Task.CompletedTask;
    }

    public Task SendApprovalEmailAsync(string ownerUserEmail)
    {
        return Task.CompletedTask;
    }
}