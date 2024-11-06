using System.ComponentModel.DataAnnotations.Schema;
using SportLink.Core.Enums;

namespace SportLink.API.Services.OTPCode;

public interface IOTPCodeService
{
    Task<string> GenerateOTP(int userId, OTPCodeTypeEnum type, int digits = 6);
    Task<bool> ValidateOTP(int userId, OTPCodeTypeEnum type, string code);
    // Task<bool> MarkOTPUsed(int userId, string code);
}