using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;

namespace SportLink.API.Services.Sports;

public class SportService : ISportService
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public SportService(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<SportDto>> GetAllSportsAsync()
    {
        var sports = await _context.Sports.OrderBy(s => s.Name).ToListAsync();
        return _mapper.Map<List<SportDto>>(sports);
    }

}