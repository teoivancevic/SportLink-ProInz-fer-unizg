using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Services.Search;

public class TournamentSearchService : ISearchService<TournamentSearchDto, TournamentSearchParameters>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public TournamentSearchService(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<List<TournamentSearchDto>> SearchAsync(TournamentSearchParameters parameters)
    {
        var query = _context.Tournaments
            .Include(t => t.Organization)
            .Include(t => t.Sport)
            .AsQueryable();
        if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
        {
            query = query.Where(t => t.Name.ToLower().Contains(parameters.SearchTerm.ToLower()) || 
                                     t.Description.ToLower().Contains(parameters.SearchTerm.ToLower()) ||
                                     t.Organization.Name.ToLower().Contains(parameters.SearchTerm.ToLower()));
        }

        if (parameters.SportIds != null && parameters.SportIds.Any())
        {
            query = query.Where(t => parameters.SportIds.Contains(t.SportId));
        }

        if (parameters.MaxPrice.HasValue)
        {
            query = query.Where(t => t.EntryFee <= parameters.MaxPrice);
        }
        
        var effectiveStartDate = parameters.StartDate ?? DateTime.Today;
        query = query.Where(t => t.TimeFrom >= effectiveStartDate);

        if (parameters.EndDate.HasValue)
        {
            query = query.Where(t => t.TimeTo <= parameters.EndDate.Value);
        }
        
        var tournaments = await query.ToListAsync();
        return _mapper.Map<List<TournamentSearchDto>>(tournaments);
    }
}