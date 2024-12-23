using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using SportLink.Core.Models;

namespace SportLink.API.Services.Email;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task SendVerificationEmailAsync(string to, string otpCode)
    {
        var subject = "[SportLink] - Verify Email";
        var body = $"""
                    Hi!
                    Welcome to SportLink!

                    Your code: {otpCode}
                    """;

        await SendEmailAsync(to, subject, body);
    }

    public async Task SendRejectionEmailAsync(OrganizationDto organization, string reason, string ownerUserEmail)
    {
        var subject = "[SportLink] - Organization Rejection";
        var to = ownerUserEmail;
        var body = $"""
                    Hi!
                    We are sorry to inform you that your organization has been rejected.
                    Here are the details of your request:

                    Organization Name: {organization.Name}
                    Organization Description: {organization.Description}
                    Organization Contact Email: {organization.ContactEmail}
                    Organization Contact Phone Number: {organization.ContactPhoneNumber}
                    Organization Location: {organization.Location}

                    Reason for Rejection: {reason}

                    Kind regards,
                    SportLink Team
                    """;

        await SendEmailAsync(to, subject, body);
    }

    public async Task SendCreationEmailAsync(OrganizationDto organizationDto, string ownerUserEmail)
    {
        var subject = "[SportLink] - Organization Creation";
        var to = ownerUserEmail;
        var body = $"""
                    Hi!
                    We received your request to create an organization. 
                    Here's the data that you provided:

                    Organization Name: {organizationDto.Name}
                    Organization Description: {organizationDto.Description}
                    Organization Contact Email: {organizationDto.ContactEmail}
                    Organization Contact Phone Number: {organizationDto.ContactPhoneNumber}
                    Organization Location: {organizationDto.Location}

                    Please wait for approval. 
                    Once approved, you will receive an email.

                    Kind regards,
                    SportLink Team
                    """;

        await SendEmailAsync(to, subject, body);
    }

    public async Task SendApprovalEmailAsync(string ownerUserEmail)
    {
        var subject = "[SportLink] - Organization Approval";
        var to = ownerUserEmail;
        var body = $"""
                    Hi!
                    We are happy to inform you that your organization has been approved.
                    You can now view your organization's profile on the SportLink platform.

                    Kind regards,
                    SportLink Team
                    """;

        await SendEmailAsync(to, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(_settings.SenderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };
            message.To.Add(to);

            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_settings.SenderEmail, _settings.AppPassword)
            };

            await client.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            // Log the error
            throw new Exception("Failed to send email", ex);
        }
    }
}