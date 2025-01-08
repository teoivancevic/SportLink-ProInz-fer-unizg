using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportLink.Core.Models;

namespace SportLink.API.Services.Organization
{
    public interface IOrganizationService
    {
        Task<ActionResult<OrganizationDto>> CreateOrganization(OrganizationDto organization);
        Task<List<OrganizationDto>> GetOrganizations(bool isVerified);
        Task<OrganizationDto> GetSingleOrganization(int id);
        Task<bool> VerifyOrganization(int id);
        Task<bool> DeclineOrganization(int id, string reason);
        Task<List<OrganizationDto>> GetMyOrganizations();

        // ---------------------- Organization's Profile ---------------------- //

        Task<bool> AddTournament(int id, TournamentDto tournament);
        Task<bool> AddTrainingGroup(int id, TrainingGroupDto trainingGroup);
        //Task<ProfileDto> GetProfile(int id);
        Task<List<SportCourtDto>> GetSportCourts(int id);
        Task<List<TournamentDto>> GetTournaments(int id);
        Task<List<TrainingGroupDto>> GetTrainingGroups(int id);
        Task<ActionResult<ProfileDto>> UpdateProfile(int id, ProfileDto profile);
        Task<bool> AddSportCourt(int id, SportCourtDto sportCourt);
    }
}