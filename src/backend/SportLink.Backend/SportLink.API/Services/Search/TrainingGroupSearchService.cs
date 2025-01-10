//using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

namespace SportLink.API.Services.Search;

public class TrainingGroupSearchService : ISearchService<TrainingGroupSearchDto, TrainingGroupSearchParameters>
{
    private readonly DataContext _context;
    //private readonly Mapper _mapper;

    public TrainingGroupSearchService(DataContext context)
    {
        _context = context;
        //_mapper = mapper;
    }

    public async Task<List<TrainingGroupSearchDto>> SearchAsync(TrainingGroupSearchParameters parameters)
    {
        var query = _context.TrainingGroups
            .Include(tg => tg.TrainingSchedules)
            .Include(tg => tg.Organization)
            .Include(tg => tg.Sport)
            .AsQueryable();
        
        if (!string.IsNullOrEmpty(parameters.SearchTerm))
        {
            var searchTerm = parameters.SearchTerm.ToLower();
            query = query.Where(tg => tg.Name.ToLower().Contains(searchTerm)
            || tg.Description.ToLower().Contains(searchTerm)
            || tg.Organization.Name.ToLower().Contains(searchTerm));
        }
        
        if (parameters.MinAge.HasValue)
        {
            query = query.Where(tg => tg.AgeFrom >= parameters.MinAge);
        }

        if (parameters.MaxAge.HasValue)
        {
            query = query.Where(tg => tg.AgeTo <= parameters.MaxAge);
        }
        
        if (parameters.Sex.HasValue)
        {
            query = query.Where(tg => tg.Sex == parameters.Sex);
        }

        if (parameters.MinPrice.HasValue)
        {
            query = query.Where(tg => tg.MonthlyPrice >= parameters.MinPrice);
        }

        if (parameters.MaxPrice.HasValue)
        {
            query = query.Where(tg => tg.MonthlyPrice <= parameters.MaxPrice);
        }
        
        if (parameters.SportIds != null && parameters.SportIds.Any())
        {
            query = query.Where(tg => parameters.SportIds.Contains(tg.SportId));
        }
        
        var trainingGroups = await query
            .Select(tg => new TrainingGroupSearchDto
            {
                Id = tg.Id,
                Name = tg.Name,
                AgeFrom = tg.AgeFrom,
                AgeTo = tg.AgeTo,
                Sex = tg.Sex,
                MonthlyPrice = tg.MonthlyPrice,
                Description = tg.Description,
                SportName = tg.Sport.Name,
                OrganizationName = tg.Organization.Name,
                TrainingScheduleDtos = tg.TrainingSchedules.Select(ts => new TrainingScheduleDto
                {
                    DayOfWeek = ts.DayOfWeek,
                    StartTime = ts.StartTime,
                    EndTime = ts.EndTime
                }).ToList()
            })
            .ToListAsync();
        return trainingGroups;

    }
}