using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Models;

namespace SportLink.API.Services.Tournament
{
    public interface ITournamentService
    {
        Task<bool> AddTournament(TournamentDto tournament, int organizationId);
        Task<List<TournamentDto>> GetTournaments(int id);
        Task<bool> UpdateTournament(TournamentDto tournament, int idTournament);
        Task<bool> DeleteTournament(int idTournament);
    }
}