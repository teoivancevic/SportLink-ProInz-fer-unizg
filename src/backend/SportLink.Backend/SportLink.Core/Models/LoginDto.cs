using FluentValidation;

namespace SportLink.Core.Models;

public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .Length(3, 100)
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .Length(8, 100);
    }
}