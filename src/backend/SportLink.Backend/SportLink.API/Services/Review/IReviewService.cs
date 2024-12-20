
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Models;

namespace SportLink.API.Services.Review;

public interface IReviewService
{
    Task<ActionResult<CreateReviewDto>> CreateReview(CreateReviewDto createReviewDto, int organizationId);
}