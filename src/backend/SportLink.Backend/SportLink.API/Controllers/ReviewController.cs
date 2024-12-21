using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Services.Review;
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
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createReviewDto)
    {
        if (ModelState.IsValid)
        {
            var result = await _reviewService.CreateReview(createReviewDto);
            if (result.Result is BadRequestObjectResult badRequest)
            {
                ModelState.AddModelError(string.Empty, badRequest?.Value!.ToString()!);
                return BadRequest(ModelState);
            }
            return Ok(createReviewDto);
        }

        return BadRequest(ModelState);
    }
}