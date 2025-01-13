
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.Review;

public interface IReviewService
{
    Task<ActionResult<GetReviewDto>> CreateReview(CreateReviewDto createReviewDto);

    Task<List<GetReviewDto>> GetOrganizationReviews(int organizationId,
        SortOptionEnum sortOption = SortOptionEnum.UpdatedAtDescending);
    Task<GetReviewDto> RespondReview(int organizationId, int userId, string response);
    Task<GetReviewDto> DeleteReview(int organizationId);
    Task<(double AverageRating, int ReviewCount)> GetOrganizationReviewStats(int organizationId);
    Task<Dictionary<int, int>> GetOrganizatoionRatingDistribution(int organizationId);
}