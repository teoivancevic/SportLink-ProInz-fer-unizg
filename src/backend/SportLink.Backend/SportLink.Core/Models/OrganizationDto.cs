using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace SportLink.Core.Models;

public class OrganizationDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhoneNumber { get; set; }
    public string Location { get; set; }
}

public class OrganizationValidator : AbstractValidator<OrganizationDto>
{
    public OrganizationValidator()
    {
        RuleFor(x => x.Name).NotEmpty().Length(3, 100);
        RuleFor(x => x.Description).NotEmpty().Length(3, 200);
        RuleFor(x => x.ContactEmail).NotEmpty().Length(3, 100).EmailAddress();
        RuleFor(x => x.ContactPhoneNumber).NotEmpty().Length(6, 15);
        RuleFor(x => x.Location).NotEmpty().Length(3, 100);
    }
}
