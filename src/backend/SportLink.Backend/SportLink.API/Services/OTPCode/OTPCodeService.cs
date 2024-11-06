using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.Core.Enums;

namespace SportLink.API.Services.OTPCode;

public class OTPCodeService : IOTPCodeService
{
    private readonly DataContext _context;
    
    public OTPCodeService(DataContext context)
    {
        _context = context;
    }
    
    public async Task<string> GenerateOTP(int userId, OTPCodeTypeEnum type, int digits = 6)
    {
        string digitOTPCode = GenerateNumericCode(digits);

        await ClearOldOTPs(userId, type);
        
        var otpCodeEntity = await CreateOTP(userId, type, digitOTPCode);

        return otpCodeEntity.Code;
    }
    
    private string GenerateNumericCode(int length)
    {
        return string.Join("", 
            Enumerable.Range(0, length)
                .Select(_ => Random.Shared.Next(0, 10)));
    }
    

    public async Task<bool> ValidateOTP(int userId, OTPCodeTypeEnum type, string code)
    {
        var otpCodeEntity = await _context.OTPCodes.Where(x => 
            x.Code == code && 
            x.UserId == userId && 
            x.Type == type && 
            x.IsUsed == false &&
            x.ExpiresAt > DateTime.UtcNow 
            ).FirstOrDefaultAsync();

        if (otpCodeEntity is null)
            return false;

        await MarkOTPUsed(userId, code);
        
        return true;
    }


    private async Task<Data.Entities.OTPCode> CreateOTP(int userId, OTPCodeTypeEnum type, string code)
    {
        var OTPCodeEntity = new Data.Entities.OTPCode
        {
            Id = 0,
            Code = code,
            Type = type,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5)
        };

        _context.OTPCodes.Add(OTPCodeEntity);
        await _context.SaveChangesAsync();

        return OTPCodeEntity;
    }
    private async Task<bool> MarkOTPUsed(int userId, string code)
    {
        var otpCodeEntity = await _context.OTPCodes.Where(x =>
            x.UserId == userId &&
            x.Code == code
            ).FirstOrDefaultAsync();

        if (otpCodeEntity is null)
        {
            throw new Exception("Couldn't mark OTP code as used");
        }
        
        otpCodeEntity.IsUsed = true;
        _context.OTPCodes.Update(otpCodeEntity);
        await _context.SaveChangesAsync();

        return true;
    }
    
    private async Task ClearOldOTPs(int userId, OTPCodeTypeEnum type)
    {
        var otpCodes = await _context.OTPCodes.Where(x => 
            x.UserId == userId && x.Type == type).ToListAsync();

        foreach (var otpCode in otpCodes)
        {
            if (otpCode.ExpiresAt > DateTime.UtcNow)
            {
                otpCode.ExpiresAt = DateTime.UtcNow.AddDays(-1);
                _context.OTPCodes.Update(otpCode);
            }
        }
        await _context.SaveChangesAsync();
    }
}