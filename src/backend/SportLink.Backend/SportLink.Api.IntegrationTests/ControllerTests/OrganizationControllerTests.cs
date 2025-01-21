using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using SportLink.API.Data;
using SportLink.Api.IntegrationTests.Helpers;
using SportLink.Core.Models;

namespace SportLink.Api.IntegrationTests;

public class OrganizationControllerTests : IClassFixture<SportLinkWebApplicationFactory>
{
    private readonly SportLinkWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public OrganizationControllerTests(SportLinkWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }
    
    [Fact]
    public async Task CreateOrganization_WithValidTokenAndData_ReturnsOkResult()
    {
        // Arrange
        var token = TestAuthHandler.GenerateTestToken("1", "test@example.com", "User", "John", "Doe");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var organizationDto = new OrganizationDto
        {
            Name = "Test Organization",
            Description = "Test Description",
            ContactEmail = "org@example.com",
            ContactPhoneNumber = "1234567890",
            Location = "Test Location"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/organization/CreateOrganization", organizationDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<OrganizationDto>();
        result.Should().NotBeNull();
        result.Name.Should().Be(organizationDto.Name);
        result.Description.Should().Be(organizationDto.Description);
    }
    
    [Fact]
    public async Task CreateOrganization_WithInvalidRole_ReturnsForbidden()
    {
        // Arrange
        var token = TestAuthHandler.GenerateTestToken("3", "app@example.com", "AppAdmin", "App", "Admin");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var organizationDto = new OrganizationDto
        {
            Name = "Test Organization",
            Description = "Test Description",
            ContactEmail = "org@example.com",
            ContactPhoneNumber = "1234567890",
            Location = "Test Location"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/organization/CreateOrganization", organizationDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
    
    [Theory]
    [InlineData("", "Description", "email@test.com", "1234567890", "Location")]
    [InlineData("Name", "", "email@test.com", "1234567890", "Location")]
    [InlineData("Name", "Description", "", "1234567890", "Location")]
    [InlineData("Name", "Description", "invalid-email", "1234567890", "Location")]
    public async Task CreateOrganization_WithInvalidData_ReturnsBadRequest(
        string name,
        string description,
        string contactEmail,
        string contactPhone,
        string location)
    {
        // Arrange
        var token = TestAuthHandler.GenerateTestToken("1", "test@example.com", "User", "John", "Doe");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var organizationDto = new OrganizationDto
        {
            Name = name,
            Description = description,
            ContactEmail = contactEmail,
            ContactPhoneNumber = contactPhone,
            Location = location
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/organization/CreateOrganization", organizationDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    [Fact]
    public async Task CallNonExistentEndpoint_ReturnsMethodNotAllowed()
    {

        var organizationDto = new OrganizationDto
        {
            Name = "Test Organization",
            Description = "Test Description",
            ContactEmail = "org@example.com",
            ContactPhoneNumber = "1234567890",
            Location = "Test Location"
        };
        
        // Using a non-existent endpoint
        var response = await _client.PostAsJsonAsync("/api/organization/NonExistentEndpoint", organizationDto);

        response.StatusCode.Should().Be(HttpStatusCode.MethodNotAllowed);
    }

    [Fact]
    public async Task CallEndpointWithInvalidMethod_ReturnsBadRequest()
    {
        var token = TestAuthHandler.GenerateTestToken("1", "test@example.com", "User", "John", "Doe");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
        // Using GET on an endpoint that only accepts POST
        var response = await _client.GetAsync("/api/organization/CreateOrganization");
        
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

}