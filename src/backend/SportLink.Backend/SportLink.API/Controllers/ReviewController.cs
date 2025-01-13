using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Review;
using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Controllers;
[ApiController]
[Route("api/[controller]")]

public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost, Authorize(Roles = "OrganizationOwner,User", Policy = "jwt_policy")]
    [Route("")]
    public async Task<ActionResult<GetReviewDto>> CreateReview([FromBody] CreateReviewDto createReviewDto)
    {
        if (ModelState.IsValid)
        {
            var result = await _reviewService.CreateReview(createReviewDto);
            if (result.Result is BadRequestObjectResult badRequest)
            {
                ModelState.AddModelError(string.Empty, badRequest?.Value!.ToString()!);
                return BadRequest(ModelState);
            }

            return result;
        }

        return BadRequest(ModelState);
    }
    
    [HttpDelete, Authorize(Roles = "User,OrganizationOwner", Policy = "jwt_policy")]
    [Route("")]
    public async Task<ActionResult> DeleteReview(int organizationId)
    {
        var result = await _reviewService.DeleteReview(organizationId);

        if (result == null)
        {
            return BadRequest("No review found");
        }

        return Ok(result);
    }

    [HttpGet]
    [Route("organization/{organizationId}")]
    public async Task<ActionResult<List<GetReviewDto>>> GetOrganizationReviews(int organizationId, [FromQuery] SortOptionEnum sortOption = SortOptionEnum.UpdatedAtDescending)
    {
        var result = await _reviewService.GetOrganizationReviews(organizationId, sortOption);
        if (result == null)
        {
            return BadRequest("No reviews found");
        }
        return Ok(result);
    }

    [HttpPut, Authorize(Roles = "OrganizationOwner", Policy = "jwt_policy")]
    [Route("respond")]
    public async Task<ActionResult<GetReviewDto>> RespondReview(int organizationId, int userId, string response)
    { 
        var result = await _reviewService.RespondReview(organizationId, userId, response);
        if (string.IsNullOrWhiteSpace(response))
        {
            return BadRequest("Response cant be empty");
        }
        if (result == null)
        { 
            return BadRequest("Something went wrong"); 
        }

        return Ok(result);
    }

    [HttpGet]
    [Route("organization/{organizationId}/stats")]

    public async Task<IActionResult> GetReviewStats(int organizationId)
    {
        var stats = await _reviewService.GetOrganizationReviewStats(organizationId);

        // Create a response object
        var response = new
        {
            AverageRating = stats.AverageRating,
            ReviewCount = stats.ReviewCount
        };

        return Ok(response);
    }

    [HttpGet]
    [Route("organization/{organizationId}/distribution")]
    public async Task<IActionResult> GetRatingDistribution(int organizationId)
    {
        var stats = await _reviewService.GetOrganizatoionRatingDistribution(organizationId);
        return Ok(stats);
    }
    

}