using System.Collections.Immutable;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SportLink.API.Data;
using SportLink.Api.IntegrationTests.Helpers;
using SportLink.Core.Enums;
using SportLink.Core.Models;
using Xunit.Abstractions;

namespace SportLink.Api.IntegrationTests;

public class SportsObjectControllerTests : IClassFixture<SportLinkWebApplicationFactory>
{
    private readonly SportLinkWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly ITestOutputHelper _output;

    public SportsObjectControllerTests(SportLinkWebApplicationFactory factory, ITestOutputHelper output)
    {
        _factory = factory;
        _client = _factory.CreateClient();
        _output = output;
    }
    
    [Fact]
    public async Task GetSportsObject_ReturnsOk()
    {
        _factory.ReInitializeDbForTests();
        var response = await _client.GetAsync("api/SportsObject/organization/1");
        var result = await response.Content.ReadFromJsonAsync<List<SportObjectDto>>();
        result[0].Should().NotBeNull();
        result[0].Name.Should().Be("Central Tennis Complex");
        result[0].Id.Should().Be(1);
        response.EnsureSuccessStatusCode();
    }
    
    // [Fact]
    // public async Task UpdateSportsObject_ReturnsOk()
    // {
    //     // Arrange
    //     var token = TestAuthHandler.GenerateTestToken("1", "john@example.com", "OrganizationOwner", "John", "Doe");
    //     _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    //
    //     var getSportObjects = await _client.GetAsync("api/SportsObject/organization/1");
    //     var result = await getSportObjects.Content.ReadFromJsonAsync<List<SportObjectDto>>();
    //     var sameSportObject = result[0];
    //     sameSportObject.Id.Should().Be(1);
    //
    //     // Debug logging
    //     
    //
    //     if (sameSportObject.SportCourts == null || !sameSportObject.SportCourts.Any())
    //     {
    //         sameSportObject.SportCourts = new List<SportCourtDto>
    //         {
    //             new SportCourtDto
    //             {
    //                 Id = 1,
    //                 SportId = 1,
    //                 AvailableCourts = 6,
    //                 SportsObjectId = 1,
    //                 MaxHourlyPrice = 40.00M
    //             }
    //         };
    //     }
    //     
    //     _output.WriteLine($"Sport Object to update: {System.Text.Json.JsonSerializer.Serialize(sameSportObject, new System.Text.Json.JsonSerializerOptions { WriteIndented = true })}");
    //     
    //     var response = await _client.PutAsJsonAsync("api/SportsObject?idSportObject=1", sameSportObject);
    //
    //     if (!response.IsSuccessStatusCode)
    //     {
    //         var errorContent = await response.Content.ReadAsStringAsync();
    //         _output.WriteLine($"Response Status Code: {response.StatusCode}");
    //         _output.WriteLine($"Response Headers: {string.Join(", ", response.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}"))}");
    //         _output.WriteLine($"Error Content: {errorContent}");
    //     
    //         // If you're using developer exception page in tests, this might give more details
    //         if (errorContent.Contains("Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddleware"))
    //         {
    //             _output.WriteLine("Full error stack trace found in response");
    //         }
    //     }
    //
    //     response.EnsureSuccessStatusCode();
    // }
    
    [Fact]
    public async Task UpdateSportsObject_ReturnsOk()
    {
        // Arrange
        var token = TestAuthHandler.GenerateTestToken("1", "john@example.com", "OrganizationOwner", "John", "Doe");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    
        // Get existing data
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            var sportObject = await context.SportsObjects
                .Include(x => x.SportCourts)
                .Include(x => x.WorkTimes)
                .FirstOrDefaultAsync(x => x.Id == 1);
            
            // Get the current state from API
            var getSportObjects = await _client.GetAsync("api/SportsObject/organization/1");
            var result = await getSportObjects.Content.ReadFromJsonAsync<List<SportObjectDto>>();
            var updateDto = result[0];
        
            // Preserve the sport courts from DB since they're missing in the GET response
            updateDto.SportCourts = sportObject.SportCourts.Select(sc => new SportCourtDto
            {
                Id = sc.Id,
                SportId = sc.SportId,
                AvailableCourts = sc.AvailableCourts,
                SportsObjectId = sc.SportsObjectId,
                MaxHourlyPrice = sc.maxHourlyPrice
            }).ToList();

            _output.WriteLine("Sport Object to update:");
            _output.WriteLine(JsonSerializer.Serialize(updateDto, new JsonSerializerOptions { WriteIndented = true }));

            var response = await _client.PutAsJsonAsync("api/SportsObject?idSportObject=1", updateDto);
        
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _output.WriteLine($"Response Status Code: {response.StatusCode}");
                _output.WriteLine($"Error Content: {errorContent}");
            }

            response.EnsureSuccessStatusCode();
        }
    }

}