using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.Core.Enums;
using SportLink.Core.Models;

namespace SportLink.API.Services.Review;

public class ReviewService : IReviewService
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public ReviewService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ActionResult<GetReviewDto>> CreateReview(CreateReviewDto createReviewDto)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        var user = await _context.Users.FindAsync(int.Parse(userId!));
        var organization = await _context.Organizations.FindAsync(createReviewDto.organizationId);
        
        if (user == null || organization == null)
        {
            return new BadRequestResult(); // Invalid user or organization
        }
        if (user.Id == organization.OwnerId)
        {
            return new ForbidResult();
        }
        if (organization.VerificationStatus != VerificationStatusEnum.Accepted)
        {
            return new BadRequestResult();
        }
        
        //TODO provjeri postoji li vec taj review
        var checkReview = await _context.Reviews.FindAsync(new object[] { int.Parse(userId!), createReviewDto.organizationId });
        if (checkReview != null)
        {
            return new BadRequestResult();
        }
        
        var review = new Data.Entities.Review
        {
            Rating = createReviewDto.Rating,
            Description = createReviewDto.Description,
            Response = null,
            UserId = int.Parse(userId!),
            OrganizationId = createReviewDto.organizationId,
            User = user,
            Organization = organization 
        };
        
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();

        var retrieveDto = _mapper.Map<GetReviewDto>(review);
        return new OkObjectResult(retrieveDto);

    }

    public async Task<List<GetReviewDto>> GetOrganizationReviews(int organizationId)
    {
        var reviews = await _context.Reviews.Where(r => r.OrganizationId == organizationId).ToListAsync();
        return _mapper.Map<List<GetReviewDto>>(reviews);
    }

    public async Task<GetReviewDto> RespondReview(int organizationId, int userId, string response)
    {
        var loggedUserId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        var organization = await _context.Organizations.FindAsync(organizationId);
        if (int.Parse(loggedUserId!) != organization.OwnerId)
        {
            return null;
        }
        var review = await _context.Reviews.FindAsync(new object[] { organizationId, userId });
        
        if (review == null)
        {
            return null;
        }
        review.Response = response;
        await _context.SaveChangesAsync();
        
        GetReviewDto reviewDto = _mapper.Map<GetReviewDto>(review);
        return reviewDto;

    }

    public async Task<GetReviewDto> DeleteReview(int organizationId)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        var review = await _context.Reviews.FindAsync(new object[] { organizationId, int.Parse(userId!) });
        if (review == null)
        {
            return null;
        }
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        GetReviewDto reviewDto = _mapper.Map<GetReviewDto>(review);
        return reviewDto;
    }


}