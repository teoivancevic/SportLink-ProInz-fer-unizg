using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using SportLink.Core.Enums;

namespace SportLink.Core.Models
{
    public class TrainingGroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int AgeFrom { get; set; }
        public int AgeTo { get; set; }
        public SexEnum Sex { get; set; }
        public decimal MonthlyPrice { get; set; }
        public string Description { get; set; }
        public int OrganizationId { get; set; }
        public int SportId { get; set; }
        public string SportName { get; set; }
        public List<TrainingScheduleDto> TrainingSchedules { get; set; }
    }

    public class TrainingGroupValidator : AbstractValidator<TrainingGroupDto>
    {
        public TrainingGroupValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
            RuleFor(x => x.Sex).NotEmpty().WithMessage("Sex is required.");
            RuleFor(x => x.MonthlyPrice).NotEmpty().WithMessage("Monthly price is required.");
            RuleFor(x => x.SportId).NotEmpty().WithMessage("Sport is required.");
            RuleFor(x => x.TrainingSchedules).NotEmpty().WithMessage("Training schedules are required.");
            RuleFor(x => x.AgeFrom).NotEmpty().WithMessage("AgeFrom is required.");
            RuleFor(x => x.AgeTo).NotEmpty().WithMessage("AgeTo is required.");

            RuleFor(x => x.AgeFrom).LessThan(x => x.AgeTo).WithMessage("AgeTo must be greater than or equal to AgeFrom.");
        }
    }
}