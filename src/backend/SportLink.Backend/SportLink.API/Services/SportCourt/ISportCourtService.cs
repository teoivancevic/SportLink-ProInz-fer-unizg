using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Models;

namespace SportLink.API.Services.SportCourt
{
    public interface ISportCourtService
    {
        Task<bool> AddSportObject(int id, SportObjectDto sportObject);
        Task<bool> DeleteSportObject(int sportObjectId);
        Task<bool> UpdateSportObject(SportObjectDto sportObject, int idSportObject);
        Task<List<SportObjectDto>> GetSportObjects(int id);
    }
}