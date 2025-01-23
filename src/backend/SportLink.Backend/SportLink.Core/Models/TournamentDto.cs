using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace SportLink.Core.Models
{
    public class TournamentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime TimeFrom { get; set; }
        public DateTime TimeTo { get; set; }
        public decimal EntryFee { get; set; }
        public string Location { get; set; }
        public int OrganizationId { get; set; }
        public string SportName { get; set; }
        public int SportId { get; set; }
    }

    public class TournamentValidator : AbstractValidator<TournamentDto>
    {
        public TournamentValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.Location).NotEmpty().WithMessage("Location is required.");
            RuleFor(x => x.EntryFee).NotEmpty().WithMessage("Entry fee is required.");
            RuleFor(x => x.SportId).NotEmpty().WithMessage("Sport is required.");
            RuleFor(x => x.TimeFrom).NotEmpty().WithMessage("Time from is required.");
            RuleFor(x => x.TimeTo).NotEmpty().WithMessage("Time to is required.");

            RuleFor(x => x.TimeFrom).LessThan(x => x.TimeTo).WithMessage("TimeTo must be later than TimeFrom.");
            RuleFor(x => x.TimeFrom).GreaterThan(DateTime.Now).WithMessage("TimeFrom must be later than current time.");
            RuleFor(x => x.TimeTo).GreaterThan(DateTime.Now).WithMessage("TimeTo must be later than current time.");
        }

        // private static bool IsTimeRangeValid(DateTime? timeFrom, DateTime? timeTo)
        // {
        //     if (timeTo > timeFrom)
        //     {
        //         return true;
        //     }
        //     return false;
        // }
    }
}