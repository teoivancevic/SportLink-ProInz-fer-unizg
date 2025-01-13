using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.Core.Models;
using SportLink.API.Data.Entities;

namespace SportLink.API.Services.SportCourt
{
    public class SportCourtService : ISportCourtService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public SportCourtService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<SportCourtDto>> GetSportCourts(int id)
        {
            //var sportCourts = await _context.SportCourts.Include(sc => sc.SportsObject).Where(sc => sc.SportsObject.OrganizationId == id).ToListAsync();

            var sportCourts = await _context.SportCourts
            .Include(sc => sc.SportsObject)
            .ThenInclude(so => so.WorkTimes)
            .Where(sc => sc.SportsObject.OrganizationId == id)
            .Select(sc => new SportCourtDto
            {
                SportId = sc.SportId,
                AvailableCourts = sc.AvailableCourts,
                SportsObjectId = sc.SportsObjectId,
                CurrencyISO = sc.CurrencyISO,
                MinHourlyPrice = sc.minHourlyPrice,
                MaxHourlyPrice = sc.maxHourlyPrice,
                Description = sc.SportsObject.Description,
                Location = sc.SportsObject.Location,
                OrganizationId = sc.SportsObject.OrganizationId,
                WorkTimes = sc.SportsObject.WorkTimes.Select(wt => new WorkTimeDto
                {
                    SportsObjectId = sc.SportsObjectId,
                    DaysOfWeek = WorkTimeDto.ToDaysOfWeekList(wt.DaysOfWeek),
                    OpenFrom = wt.OpenFrom.ToString(),
                    OpenTo = wt.OpenTo.ToString()
                }).ToList()
            })
            .ToListAsync();
            return sportCourts!;
            //return _mapper.Map<List<SportCourtDto>>(sportCourts);
        }

        public async Task<bool> AddSportCourt(int id, SportCourtDto sportCourtDto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }

            var sportsObject = new SportsObject
            {
                Description = sportCourtDto.Description,
                Location = sportCourtDto.Location,
                OrganizationId = sportCourtDto.OrganizationId,
                WorkTimes = sportCourtDto.WorkTimes.Select(wt => new WorkTime
                {
                    DaysOfWeek = WorkTimeDto.ToDaysOfWeekString(wt.DaysOfWeek),
                    OpenFrom = TimeOnly.Parse(wt.OpenFrom),
                    OpenTo = TimeOnly.Parse(wt.OpenTo)

                    //OpenFrom = new TimeOnly(wt.OpenFrom.Hour, wt.OpenFrom.Minute),
                    //OpenTo = new TimeOnly(wt.OpenTo.Hour, wt.OpenTo.Minute)
                    //OpenFrom = wt.OpenFrom.ToTimeOnly(),
                    //OpenTo = wt.OpenTo.ToTimeOnly()
                }).ToList()
            };

            //_context.CourtBookings.Add(_mapper.Map<SportCourt>(sportCourtDto)); krivo
            _context.SportsObjects.Add(sportsObject);
            await _context.SaveChangesAsync();

            var workTime = sportCourtDto.WorkTimes.Select(wt => new WorkTime
            {
                DaysOfWeek = WorkTimeDto.ToDaysOfWeekString(wt.DaysOfWeek),
                OpenFrom = TimeOnly.Parse(wt.OpenFrom),
                OpenTo = TimeOnly.Parse(wt.OpenTo),
                // OpenFrom = new TimeOnly(wt.OpenFrom.Hour, wt.OpenFrom.Minute),
                // OpenTo = new TimeOnly(wt.OpenTo.Hour, wt.OpenTo.Minute),
                SportsObjectId = sportCourtDto.SportsObjectId
            }).ToList();

            _context.WorkTimes.AddRange(workTime);
            await _context.SaveChangesAsync();

            var sportCourt = new Data.Entities.SportCourt
            {
                SportId = sportCourtDto.SportId,
                AvailableCourts = sportCourtDto.AvailableCourts,
                CurrencyISO = sportCourtDto.CurrencyISO,
                minHourlyPrice = sportCourtDto.MinHourlyPrice,
                maxHourlyPrice = sportCourtDto.MaxHourlyPrice,
                SportsObjectId = sportsObject.Id
            };

            _context.SportCourts.Add(sportCourt);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSportCourt(int id, SportCourtDto sportCourt, int sportCourtId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var sportCourtToUpdate = await _context.SportCourts.FindAsync(sportCourtId);
            if (sportCourtToUpdate is null)
            {
                return false;
            }
            sportCourt.OrganizationId = id;
            _mapper.Map(sportCourt, sportCourtToUpdate);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSportCourt(int id, int sportCourtId)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org is null)
            {
                return false;
            }
            var sportCourtToDelete = await _context.SportCourts.FindAsync(sportCourtId);
            if (sportCourtToDelete is null)
            {
                return false;
            }
            _context.SportCourts.Remove(sportCourtToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}