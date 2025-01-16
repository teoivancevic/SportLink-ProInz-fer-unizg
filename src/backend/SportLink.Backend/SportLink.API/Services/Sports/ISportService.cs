using SportLink.Core.Models;

namespace SportLink.API.Services.Sports;

public interface ISportService
{ 
    Task<List<SportDto>> GetAllSportsAsync();
}