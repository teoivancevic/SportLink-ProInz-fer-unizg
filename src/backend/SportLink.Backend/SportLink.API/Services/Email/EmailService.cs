using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

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