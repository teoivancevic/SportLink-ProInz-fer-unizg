using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SportLink.Core.Models;

namespace SportLink.API.Services.Tournament
{
    public interface ITournamentService
    {
        Task<bool> AddTournament(int id, TournamentDto tournament);
        Task<List<TournamentDto>> GetTournaments(int id);
        Task<bool> UpdateTournament(int id, TournamentDto tournament, int tournamentId);
        Task<bool> DeleteTournament(int id, int idTournament);
    }
}