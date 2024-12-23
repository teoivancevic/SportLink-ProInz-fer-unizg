
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Models;

namespace SportLink.API.Services.Review;

public interface IReviewService
{
    Task<ActionResult<GetReviewDto>> CreateReview(CreateReviewDto createReviewDto);
    Task<List<GetReviewDto>> GetOrganizationReviews(int organizationId);
    Task<GetReviewDto> RespondReview(int organizationId, int userId, string response);
    Task<GetReviewDto> DeleteReview(int organizationId);
}