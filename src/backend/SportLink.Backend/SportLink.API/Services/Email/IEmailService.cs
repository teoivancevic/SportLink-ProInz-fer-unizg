namespace SportLink.API.Services.Email;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string to, string otpCode);
    Task SendRejectionEmailAsync(string to, string reason);
}