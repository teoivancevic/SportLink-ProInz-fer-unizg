﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Services.Review;
using SportLink.Core.Enums;
using SportLink.Core.Models;
using Swashbuckle.AspNetCore.Annotations;

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
    /// <summary>
    /// User deletes review on an organization
    /// </summary>
    /// <param name="organizationId"></param>
    /// <returns></returns>
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
    
    /// <summary>
    /// Get organization reviews in certain order
    /// </summary>
    /// <param name="organizationId"></param>
    /// <param name="sortOption"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("organization/{organizationId}")]
    public async Task<ActionResult<List<GetReviewDto>>> GetOrganizationReviews(int organizationId, 
        [SwaggerParameter(Description = "0 - UpdatedAtDesc, 1 - UpdatedAtAsc, 2 - RatingDesc, 3 - RatingAsc")]
        [FromQuery] SortOptionEnum sortOption = SortOptionEnum.UpdatedAtDescending)
    {
        var result = await _reviewService.GetOrganizationReviews(organizationId, sortOption);
        if (result == null)
        {
            return BadRequest("No reviews found");
        }
        return Ok(result);
    }
    
    
    /// <summary>
    /// Organization owner responds to a review by user of userId
    /// </summary>
    /// <param name="organizationId"></param>
    /// <param name="userId"></param>
    /// <param name="response"></param>
    /// <returns></returns>
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
    /// <summary>
    /// Gets organization's average rating and number of reviews
    /// </summary>
    /// <param name="organizationId"></param>
    /// <returns></returns>
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
    /// <summary>
    /// Gets review rating distribution
    /// </summary>
    /// <param name="organizationId"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("organization/{organizationId}/distribution")]
    public async Task<IActionResult> GetRatingDistribution(int organizationId)
    {
        var stats = await _reviewService.GetOrganizatoionRatingDistribution(organizationId);
        return Ok(stats);
    }
    

}