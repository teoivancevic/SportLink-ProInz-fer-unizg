using FluentValidation;

namespace SportLink.Core.Models;

public class CreateReviewDto
{
    public int Rating { get; set; }
    public string Description { get; set; }
}

public class CreateReviewDtoValidator : AbstractValidator<CreateReviewDto>
{
    public CreateReviewDtoValidator()
    {
        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5)
            .WithMessage("Rating must be between 1 and 5.");
    }
}