using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportLink.API.Data;
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

    public async Task<ActionResult<CreateReviewDto>> CreateReview(CreateReviewDto createReviewDto, int organizationId)
    {
        var userId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        var user = await _context.Users.FindAsync(int.Parse(userId!));
        var organization = await _context.Organizations.FindAsync(organizationId);
        
        if (user == null || organization == null)
        {
            return new BadRequestResult(); // Invalid user or organization
        }
        
        if (user.Id == organization.OwnerId)
        {
            return new ForbidResult(); // Organization owners cannot post reviews
        }
        
        var review = new Data.Entities.Review
        {
            Rating = createReviewDto.Rating,
            Description = createReviewDto.Description,
            Response = null,
            UserId = int.Parse(userId!),
            OrganizationId = organizationId,
            User = user,
            Organization = organization 
        };
        
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();

        var retrieveDto = _mapper.Map<RetrieveReviewDto>(review);
        return new OkObjectResult(retrieveDto);

    }
    
    
}