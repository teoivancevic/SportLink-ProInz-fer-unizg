using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Services.Search;

public class SportObjectSearchService : ISearchService<SportObjectSearchDto, SearchParameters>
{
    private readonly DataContext _context;

    public SportObjectSearchService(DataContext context)
    {
        _context = context;
    }
    public async Task<List<SportObjectSearchDto>> SearchAsync (SearchParameters parameters)
    {
        var query = _context.SportsObjects
            .Include(so => so.Organization)
            .Include(so => so.SportCourts)
            .ThenInclude(sc => sc.Sport)
            .AsQueryable();
        if (!string.IsNullOrEmpty(parameters.SearchTerm))
        {
            var searchTerm = parameters.SearchTerm.ToLower();
            query = query.Where(so => so.Name.ToLower().Contains(searchTerm)
            || so.Description.ToLower().Contains(searchTerm)
            || so.Organization.Name.ToLower().Contains(searchTerm)
            || so.Location.ToLower().Contains(searchTerm));
        }

        if (parameters.SportIds != null && parameters.SportIds.Any())
        {
            query = query.Where(so => so.SportCourts.Any(sc => parameters.SportIds.Contains(sc.SportId)));
        }

        if (parameters.MaxPrice.HasValue)
        {
            query = query.Where(so => so.SportCourts.Any(sc => 
                (!parameters.MaxPrice.HasValue || sc.minHourlyPrice <= parameters.MaxPrice.Value) &&
                (parameters.SportIds == null || !parameters.SportIds.Any() || parameters.SportIds.Contains(sc.SportId))
            ));
        }

        var sportsObjects = await query
            .Select(so => new SportObjectSearchDto
            {
                Id = so.Id,
                Name = so.Name,
                Description = so.Description,
                Location = so.Location,
                OrganizationName = so.Organization.Name,
                SportCourtDtos = so.SportCourts
                    .Where(sc =>
                        (!parameters.MaxPrice.HasValue || sc.minHourlyPrice <= parameters.MaxPrice.Value) &&
                        (parameters.SportIds == null ||  !parameters.SportIds.Any() || parameters.SportIds.Contains(sc.SportId))
                    )
                    .Select(sc => new SportCourtDto
                    {
                        Id = sc.Id,
                        SportName = sc.Sport.Name,
                        AvailableCourts = sc.AvailableCourts,
                        MinHourlyPrice = sc.minHourlyPrice,
                        MaxHourlyPrice = sc.maxHourlyPrice
                    }).ToList()
            }).ToListAsync();
        
        return sportsObjects;
    }
}