using System.Net;
using System.Net.Http.Json;
using System.Net.Mime;
using Azure;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using SportLink.API.Data;
using SportLink.API.Data.Entities;
using SportLink.Api.IntegrationTests.Helpers;
using SportLink.Core.Models;

namespace SportLink.Api.IntegrationTests;

public class AuthControllerTests : IClassFixture<SportLinkWebApplicationFactory>
{
    private readonly SportLinkWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public AuthControllerTests(SportLinkWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetUser_ValidId_ReturnsOk()
    {
        //arrange
        // using (var scope = _factory.Services.CreateScope())
        // {
        //     var scopedServices = scope.ServiceProvider;
        //     var db = scopedServices.GetRequiredService<DataContext>();
        //     
        //     Utilities.ReinitializeDbForTests(db);
        // }
        
        //Act
        var response = await _client.GetAsync("/api/user/1");
        var responseUser = await response.Content.ReadFromJsonAsync<UserDto>();
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("John", responseUser?.FirstName);
        
    }
}