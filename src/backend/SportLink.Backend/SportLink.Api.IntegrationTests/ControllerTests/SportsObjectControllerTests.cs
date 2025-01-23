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
    

}