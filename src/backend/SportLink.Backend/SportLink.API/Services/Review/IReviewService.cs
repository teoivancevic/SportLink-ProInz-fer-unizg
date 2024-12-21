
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Models;

namespace SportLink.API.Services.Review;

public interface IReviewService
{
    Task<ActionResult<GetReviewDto>> CreateReview(CreateReviewDto createReviewDto);
}