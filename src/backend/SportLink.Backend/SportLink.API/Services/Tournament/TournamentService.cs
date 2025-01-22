using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
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
                    Id = x.Id,
                    Name = x.Name,
                    TimeFrom = x.TimeFrom,
                    TimeTo = x.TimeTo,
                    EntryFee = x.EntryFee,
                    Description = x.Description,
                    Location = x.Location,
                    OrganizationId = x.OrganizationId,
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

        public async Task<bool> AddTournament(TournamentDto tournamentDto, int organizationId)
        {
            var ownerId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var org = await _context.Organizations.FindAsync(organizationId);
            if (org is null || org.OwnerId != int.Parse(ownerId!))
            {
                return false;
            }
            var tournament = new Data.Entities.Tournament
            {
                Name = tournamentDto.Name,
                TimeFrom = tournamentDto.TimeFrom,
                TimeTo = tournamentDto.TimeTo,
                EntryFee = tournamentDto.EntryFee,
                Description = tournamentDto.Description,
                Location = tournamentDto.Location,
                SportId = tournamentDto.SportId,
                OrganizationId = organizationId
            };

            // tournamentDto.SportName = await _context.Sports.Where(x => x.Id == tournamentDto.SportId).Select(x => x.Name).FirstOrDefaultAsync() ?? "";
            // tournamentDto.OrganizationId = organizationId;
            _context.Tournaments.Add(tournament);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTournament(TournamentDto tournament, int idTournament)
        {
            var ownerId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var org = await _context.Organizations.FindAsync(tournament.OrganizationId);
            if (org is null || org.OwnerId != int.Parse(ownerId!))
            {
                return false;
            }
            var tournamentToUpdate = await _context.Tournaments.FindAsync(idTournament);
            if (tournamentToUpdate is null)
            {
                return false;
            }
            else
            {
                tournament.OrganizationId = tournamentToUpdate.OrganizationId;
                tournament.SportName = await _context.Sports.Where(x => x.Id == tournament.SportId).Select(x => x.Name).FirstOrDefaultAsync() ?? "";

                _mapper.Map(tournament, tournamentToUpdate);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeleteTournament(int tournamentId)
        {
            var ownerId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var tournamentToDelete = await _context.Tournaments.FindAsync(tournamentId);
            if (tournamentToDelete is null)
            {
                return false;
            }
            var org = await _context.Organizations.FindAsync(tournamentToDelete.OrganizationId);
            if (org is null || org.OwnerId != int.Parse(ownerId!))
            {
                return false;
            }
            _context.Tournaments.Remove(tournamentToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}