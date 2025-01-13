using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Models;

namespace SportLink.API.Services.SportCourt
{
    public interface ISportCourtService
    {
        Task<bool> AddSportCourt(int id, SportCourtDto sportCourt);
        Task<bool> DeleteSportCourt(int id, int idSportCourt);
        Task<bool> UpdateSportCourt(int id, SportCourtDto sportCourt, int idSportCourt);
        Task<List<SportCourtDto>> GetSportCourts(int id);
    }
}