using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace SportLink.Core.Models
{
    public class SportObjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int OrganizationId { get; set; }
        public List<SportCourtDto> SportCourts { get; set; }
        public List<WorkTimeDto> WorkTimes { get; set; }
    }

    public class SportObjectValidator : AbstractValidator<SportObjectDto>
    {
        public SportObjectValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.Location).NotEmpty().WithMessage("Location is required.");
            RuleFor(x => x.WorkTimes).NotEmpty().WithMessage("Work times are required.");
        }
    }
}