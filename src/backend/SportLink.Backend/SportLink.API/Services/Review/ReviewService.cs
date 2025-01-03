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

        public async Task<List<GetReviewDto>> GetOrganizationReviews(int organizationId,
            SortOptionEnum sortOption = SortOptionEnum.UpdatedAtDescending)
        {
            var query = _context.Reviews
                .Where(r => r.OrganizationId == organizationId)
                .Include(r => r.User)
                .Include(r => r.Organization);
            
            var sortedQuery = sortOption switch
            {
                SortOptionEnum.UpdatedAtDescending => query.OrderByDescending(r => r.UpdatedAt),
                SortOptionEnum.UpdatedAtAscending => query.OrderBy(r => r.UpdatedAt),
                SortOptionEnum.RatingDescending => query.OrderByDescending(r => r.Rating),
                SortOptionEnum.RatingAscending => query.OrderBy(r => r.Rating),
                _ => query.OrderByDescending(r => r.UpdatedAt), // Default case
            };

            var reviews = await sortedQuery.ToListAsync();
            return _mapper.Map<List<GetReviewDto>>(reviews);
        }
        

        //kako vratiti bolju poruku?
        public async Task<GetReviewDto> RespondReview(int organizationId, int userId, string response)
        {
            var loggedUserId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var organization = await _context.Organizations.FindAsync(organizationId);
            if (loggedUserId == null || organization == null)
            {
                return null;
            }
            if (int.Parse(loggedUserId!) != organization.OwnerId)
            {
                return null;
            }
            var review = await _context.Reviews.FindAsync(new object[] { userId, organizationId });
            
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
            var review = await _context.Reviews.FindAsync(new object[] { int.Parse(userId!), organizationId });
            if (review == null)
            {
                return null;
            }
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            GetReviewDto reviewDto = _mapper.Map<GetReviewDto>(review);
            return reviewDto;
        }

        public async Task<(double AverageRating, int ReviewCount)> GetOrganizationReviewStats(int organizationId)
        {
            var reviews = await _context.Reviews.Where(r => r.OrganizationId == organizationId).ToListAsync();
            double averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
            int reviewCount = reviews.Count();
            
            return (averageRating, reviewCount);
        }

        public async Task<Dictionary<int, int>> GetOrganizatoionRatingCounts(int organizationId)
        {
            var reviewCounts = await _context.Reviews
                .Where(r => r.OrganizationId == organizationId)
                .GroupBy(r => r.Rating)
                .Select(g => new { Rating = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Rating, x => x.Count);
            
            var completeCounts = Enumerable.Range(1, 5)
                .ToDictionary(rating => rating, rating => reviewCounts.ContainsKey(rating) ? reviewCounts[rating] : 0);
            return completeCounts;
        }

    }