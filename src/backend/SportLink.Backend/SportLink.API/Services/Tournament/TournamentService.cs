using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SportLink.API.Data;
using SportLink.Core.Models;

namespace SportLink.API.Services.Tournament
{
    public class TournamentService : ITournamentService
    {

        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TournamentService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<List<TournamentDto>> GetTournaments(int id)
        {
            var tournaments = await _context.Tournaments.Include(x => x.Sport).Where(x => x.OrganizationId == id).Select(
                x => new TournamentDto
                {
                    //Id = x.Id,
                    Name = x.Name,
                    TimeFrom = x.TimeFrom,
                    TimeTo = x.TimeTo,
                    EntryFee = x.EntryFee,
                    Description = x.Description,
                    Location = x.Location,
                    OrganizationId = x.OrganizationId,
                    //OrganizationName = x.Organization.Name,
                    SportName = x.Sport.Name,
                    SportId = x.SportId
                }
            ).ToListAsync();
            if (tournaments.IsNullOrEmpty())
            {
                return null!;
            }
            return _mapper.Map<List<TournamentDto>>(tournaments);
        }

        public async Task<bool> AddTournament(int id, TournamentDto tournamentDto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            tournamentDto.OrganizationId = id;

            //_context.Tournaments.Add(_mapper.Map<Tournament>(tournamentDto));
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTournament(int id, TournamentDto tournament, int tournamentId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var tournamentToUpdate = await _context.Tournaments.FindAsync(tournamentId);
            if (tournamentToUpdate is null)
            {
                return false;
            }
            tournament.OrganizationId = id;
            _mapper.Map(tournament, tournamentToUpdate);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTournament(int id, int tournamentId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var tournamentToDelete = await _context.Tournaments.FindAsync(tournamentId);
            if (tournamentToDelete is null)
            {
                return false;
            }
            _context.Tournaments.Remove(tournamentToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}