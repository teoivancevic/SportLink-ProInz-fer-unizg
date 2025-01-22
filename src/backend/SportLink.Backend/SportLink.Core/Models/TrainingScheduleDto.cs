using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class TrainingScheduleDto
    {
        public int Id { get; set; }
        public DanUTjednuEnum DayOfWeek { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int TrainingGroupId { get; set; }
    }

    public class TrainingScheduleValidator : AbstractValidator<TrainingScheduleDto>
    {
        public TrainingScheduleValidator()
        {
            RuleFor(x => x.DayOfWeek).NotEmpty();
            RuleFor(x => x.StartTime).NotEmpty().Matches(@"^([01]\d|2[0-3]):[0-5]\d$").WithMessage("Start time must be a valid time in HH:mm format.");
            RuleFor(x => x.EndTime).NotEmpty().Matches(@"^([01]\d|2[0-3]):[0-5]\d$").WithMessage("End time must be a valid time in HH:mm format.");

            RuleFor(x => x)
                    .Must(x => IsTimeRangeValid(x.StartTime, x.EndTime))
                    .WithMessage("EndTime must be later than StartTime.");
        }

        private static bool IsTimeRangeValid(string? startTime, string? endTime)
        {
            if (TimeOnly.TryParse(startTime, out var fromTime) && TimeOnly.TryParse(endTime, out var toTime))
            {
                return toTime > fromTime;
            }
            return false;
        }
    }
}