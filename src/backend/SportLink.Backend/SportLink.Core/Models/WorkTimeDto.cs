using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class WorkTimeDto
    {
        public int Id { get; set; }
        public int SportsObjectId { get; set; }
        public DanUTjednuEnum DayOfWeek { get; set; }
        public bool IsWorking { get; set; }
        public string? OpenFrom { get; set; }
        public string? OpenTo { get; set; }
    }

    public class WorkTimeValidator : AbstractValidator<WorkTimeDto>
    {
        public WorkTimeValidator()
        {
            RuleFor(x => x.DayOfWeek).NotEmpty().WithMessage("DayOfWeek is required.");
            RuleFor(x => x.IsWorking).NotNull().WithMessage("IsWorking is required.");

            When(x => x.IsWorking, () =>
            {
                RuleFor(x => x.OpenFrom)
                    .NotEmpty()
                    .WithMessage("OpenFrom is required when IsWorking is true.")
                    .Matches(@"^([01]\d|2[0-3]):[0-5]\d$")
                    .WithMessage("OpenFrom must be a valid time in HH:mm format.");

                RuleFor(x => x.OpenTo)
                    .NotEmpty()
                    .WithMessage("OpenTo is required when IsWorking is true.")
                    .Matches(@"^([01]\d|2[0-3]):[0-5]\d$")
                    .WithMessage("OpenTo must be a valid time in HH:mm format.");

                RuleFor(x => x)
                    .Must(x => IsTimeRangeValid(x.OpenFrom, x.OpenTo))
                    .WithMessage("OpenTo must be later than OpenFrom.");
            });
        }

        private static bool IsTimeRangeValid(string? openFrom, string? openTo)
        {
            if (TimeOnly.TryParse(openFrom, out var fromTime) && TimeOnly.TryParse(openTo, out var toTime))
            {
                return toTime > fromTime;
            }
            return false;
        }
    }
}