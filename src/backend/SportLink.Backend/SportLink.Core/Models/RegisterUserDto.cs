using FluentValidation;

namespace SportLink.Core.Models;

public class RegisterUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }

    public string Password { get; set; }
}

public class RegisterUserValidator : AbstractValidator<RegisterUserDto>
{
    public RegisterUserValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .Length(3, 100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .Length(3, 100);
        
        RuleFor(x => x.Email)
            .NotEmpty()
            .Length(3, 100)
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .Length(8, 100)
            .Matches("[A-Z]").WithMessage("'{PropertyName}' must contain one or more capital letters.")
            .Matches("[a-z]").WithMessage("'{PropertyName}' must contain one or more lowercase letters.")
            .Matches(@"\d").WithMessage("'{PropertyName}' must contain one or more digits.")
            .Matches(@"[][""!@$%^&*(){}:;<>,.?/+_=|'~\\-]").WithMessage("'{ PropertyName}' must contain one or more special characters.");
    }
}


