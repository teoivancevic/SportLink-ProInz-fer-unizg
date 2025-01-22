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
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace SportLink.API.Services.SportCourt
{
    public class SportCourtService : ISportCourtService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public SportCourtService(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<SportObjectDto>> GetSportObjects(int organizationId)
        {
            var sportObjects = await _context.SportsObjects
            .Include(so => so.SportCourts)
                .ThenInclude(sc => sc.Sport)
            .Include(so => so.WorkTimes)
            .Where(so => so.OrganizationId == organizationId)
            .Select(so => new SportObjectDto
            {
                Id = so.Id,
                Name = so.Name,
                Description = so.Description,
                Location = so.Location,
                OrganizationId = so.OrganizationId,
                SportCourts = so.SportCourts.Select(sc => new SportCourtDto
                {
                    Id = sc.Id,
                    SportId = sc.SportId,
                    SportName = sc.Sport.Name,
                    AvailableCourts = sc.AvailableCourts,
                    SportsObjectId = sc.SportsObjectId,
                    MaxHourlyPrice = sc.maxHourlyPrice,
                }).ToList(),

                WorkTimes = so.WorkTimes.Select(wt => new WorkTimeDto
                {
                    Id = wt.Id,
                    SportsObjectId = so.Id,
                    DayOfWeek = wt.DayOfWeek,
                    IsWorking = wt.isWorking,
                    OpenFrom = wt.OpenFrom.ToString()!,
                    OpenTo = wt.OpenTo.ToString()!
                }).ToList()
            })
            .ToListAsync();
            return sportObjects!;
        }

        public async Task<bool> AddSportObject(int organizationId, SportObjectDto sportObjectDto)
        {
            var org = await _context.Organizations.FindAsync(organizationId);
            if (org is null)
            {
                return false;
            }

            var sportsObject = new SportsObject
            {
                Name = sportObjectDto.Name,
                Description = sportObjectDto.Description,
                Location = sportObjectDto.Location,
                OrganizationId = organizationId,
            };

            _context.SportsObjects.Add(sportsObject);
            await _context.SaveChangesAsync();

            var workTime = sportObjectDto.WorkTimes.Select(wt =>
            {
                if (string.IsNullOrEmpty(wt.DayOfWeek.ToString()))
                {
                    throw new ArgumentException("DayOfWeek must be defined.");
                }
                if (!wt.IsWorking)
                {
                    if (!string.IsNullOrEmpty(wt.OpenFrom) || !string.IsNullOrEmpty(wt.OpenTo))
                    {
                        throw new ArgumentException($"Invalid data for closed day '{wt.DayOfWeek}': OpenFrom and OpenTo must be null when IsWorking is false.");
                    }

                    return new WorkTime
                    {
                        isWorking = false,
                        DayOfWeek = wt.DayOfWeek,
                        OpenFrom = null,
                        OpenTo = null,
                        SportsObjectId = sportsObject.Id
                    };
                }
                else
                {
                    if (string.IsNullOrEmpty(wt.OpenFrom) || string.IsNullOrEmpty(wt.OpenTo))
                    {
                        throw new ArgumentException($"Invalid data for working day '{wt.DayOfWeek}': OpenFrom and OpenTo must be defined when IsWorking is true.");
                    }

                    return new WorkTime
                    {
                        isWorking = true,
                        DayOfWeek = wt.DayOfWeek,
                        OpenFrom = TimeOnly.Parse(wt.OpenFrom),
                        OpenTo = TimeOnly.Parse(wt.OpenTo),
                        SportsObjectId = sportsObject.Id
                    };
                }
            }).ToList();

            _context.WorkTimes.AddRange(workTime);
            await _context.SaveChangesAsync();

            foreach (var sportCourtDto in sportObjectDto.SportCourts)
            {
                var sportcourt = new Data.Entities.SportCourt
                {
                    SportId = sportCourtDto.SportId,
                    AvailableCourts = sportCourtDto.AvailableCourts,
                    maxHourlyPrice = sportCourtDto.MaxHourlyPrice,
                    SportsObjectId = sportsObject.Id
                };

                _context.SportCourts.Add(sportcourt);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateSportObject(SportObjectDto sportObject, int sportObjectId)
        {
            var ownerId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var org = await _context.Organizations.FindAsync(sportObject.OrganizationId);
            if (org is null || org.OwnerId != int.Parse(ownerId!))
            {
                return false;
            }
            var sportObjectToUpdate = await _context.SportsObjects.FindAsync(sportObjectId);
            if (sportObjectToUpdate is null)
            {
                return false;
            }
            else
            {
                sportObjectToUpdate.Name = sportObject.Name;
                sportObjectToUpdate.Description = sportObject.Description;
                sportObjectToUpdate.Location = sportObject.Location;

                var sportCourts = await _context.SportCourts.Where(x => x.SportsObjectId == sportObjectId).ToListAsync();
                foreach (var sc in sportObject.SportCourts)
                {
                    var match = sportCourts.FirstOrDefault(x => x.Id == sc.Id);
                    if (match is null)
                    {
                        var sportCourt = new Data.Entities.SportCourt
                        {
                            SportId = sc.SportId,
                            AvailableCourts = sc.AvailableCourts,
                            maxHourlyPrice = sc.MaxHourlyPrice,
                            SportsObjectId = sportObject.Id
                        };
                        _context.SportCourts.Add(sportCourt);
                        await _context.SaveChangesAsync();
                        sc.Id = sportCourt.Id;
                    }
                    else if (match is not null && sc.AvailableCourts != match.AvailableCourts
                            || sc.MaxHourlyPrice != match.maxHourlyPrice
                            || sc.SportId != match.SportId)
                    {
                        match.AvailableCourts = sc.AvailableCourts;
                        match.maxHourlyPrice = sc.MaxHourlyPrice;
                        match.SportId = sc.SportId;
                    }
                }

                var sportObjectSportCourts = await _context.SportCourts.Where(x => x.SportsObjectId == sportObjectId).ToListAsync();
                foreach (var sc in sportObjectSportCourts)
                {
                    var match = sportObject.SportCourts.FirstOrDefault(x => x.Id == sc.Id);
                    if (match is null)
                    {
                        _context.SportCourts.Remove(sc);
                    }
                }
                var workTimes = await _context.WorkTimes.Where(x => x.SportsObjectId == sportObjectId).ToListAsync();
                foreach (var wt in sportObject.WorkTimes)
                {
                    var match = workTimes.FirstOrDefault(x => x.Id == wt.Id);
                    if (match is null)
                    {
                        var workTime = new WorkTime
                        {
                            isWorking = wt.IsWorking,
                            DayOfWeek = wt.DayOfWeek,
                            OpenFrom = wt.IsWorking ? TimeOnly.Parse(wt.OpenFrom) : null,
                            OpenTo = wt.IsWorking ? TimeOnly.Parse(wt.OpenTo) : null,
                            SportsObjectId = wt.SportsObjectId
                        };
                        _context.WorkTimes.Add(workTime);
                        await _context.SaveChangesAsync();
                        wt.Id = workTime.Id;
                    }
                    else if (match is not null &&
                            (wt.DayOfWeek != match.DayOfWeek ||
                            (wt.IsWorking && (TimeOnly.Parse(wt.OpenFrom) != match.OpenFrom ||
                                            TimeOnly.Parse(wt.OpenTo) != match.OpenTo))))
                    {
                        match.DayOfWeek = wt.DayOfWeek;

                        if (wt.IsWorking)
                        {
                            match.OpenFrom = TimeOnly.Parse(wt.OpenFrom);
                            match.OpenTo = TimeOnly.Parse(wt.OpenTo);
                        }
                        else
                        {
                            match.OpenFrom = null;
                            match.OpenTo = null;
                        }
                    }
                }

                var sportObjectWorkTimes = await _context.WorkTimes.Where(x => x.SportsObjectId == sportObjectId).ToListAsync();
                foreach (var wt in sportObjectWorkTimes)
                {
                    var match = sportObject.WorkTimes.FirstOrDefault(x => x.Id == wt.Id);
                    if (match is null)
                    {
                        _context.WorkTimes.Remove(wt);
                    }
                }

                _mapper.Map(sportObject, sportObjectToUpdate);
                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeleteSportObject(int sportObjectId)
        {
            var ownerId = _httpContextAccessor.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var sportObjectToDelete = await _context.SportsObjects.FindAsync(sportObjectId);
            if (sportObjectToDelete is null)
            {
                return false;
            }
            var org = await _context.Organizations.FindAsync(sportObjectToDelete.OrganizationId);
            if (org is null || org.OwnerId != int.Parse(ownerId!))
            {
                return false;
            }
            _context.SportsObjects.Remove(sportObjectToDelete);
            _context.WorkTimes.RemoveRange(_context.WorkTimes.Where(x => x.SportsObjectId == sportObjectId));
            _context.SportCourts.RemoveRange(_context.SportCourts.Where(x => x.SportsObjectId == sportObjectId));
            await _context.SaveChangesAsync();
            return true;
        }
    }
}