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
using Xunit.Abstractions;

namespace SportLink.Api.IntegrationTests;

public class AuthControllerTests : IClassFixture<SportLinkWebApplicationFactory>
{
    private readonly SportLinkWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly ITestOutputHelper _output;

    public AuthControllerTests(SportLinkWebApplicationFactory factory, ITestOutputHelper output)
    {
        _factory = factory;
        _client = _factory.CreateClient();
        _output = output;
    }

    // [Fact]
    // public async Task GetUser_ValidId_ReturnsOk()
    // {
    //     var response = await _client.GetAsync("/api/user/1");
    //     var responseUser = await response.Content.ReadFromJsonAsync<UserDto>();
    //     response.EnsureSuccessStatusCode();
    //     Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    //     Assert.Equal("John", responseUser?.FirstName);
    //     
    // }
    
    [Fact]
    public async Task GetUser_ValidId_ReturnsOk()
    {
        // Log database state
        using (var scope = _factory.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();
            var user = await context.Users.FindAsync(1);
            _output.WriteLine($"Test database - User 1 exists: {user != null}, Name: {user?.FirstName}");
        }

        var response = await _client.GetAsync("/api/user/1");
        var rawContent = await response.Content.ReadAsStringAsync();
        _output.WriteLine($"Response Status: {response.StatusCode}");
        _output.WriteLine($"Raw response: {rawContent}");

        response.EnsureSuccessStatusCode();
        var responseUser = await response.Content.ReadFromJsonAsync<UserDto>();
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("John", responseUser?.FirstName);
    }

    [Fact]
    public async Task RegisterUser_ValidCredentials_ReturnsOk()
    {
        var registerUserDto = new RegisterUserDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Test1234!"
        };
        
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerUserDto);
        
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var userDto = await response.Content.ReadFromJsonAsync<UserDto>();
        userDto.Should().NotBeNull();
        userDto.Email.Should().Be(registerUserDto.Email);
        userDto.FirstName.Should().Be(registerUserDto.FirstName);
        userDto.LastName.Should().Be(registerUserDto.LastName);
    }
    
    [Fact(Skip = "Not implemented yet")]
    public async Task RegisterUser_WithExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var existingUser = new RegisterUserDto
        {
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane@example.com",
            Password = "StrongPass123!"
        };

        // First registration
        await _client.PostAsJsonAsync("/api/auth/register", existingUser);

        // Try to register with same email
        var response = await _client.PostAsJsonAsync("/api/auth/register", existingUser);
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    
    [Theory]
    [InlineData("", "Doe", "john@example.com", "Password123!")]
    [InlineData("John", "", "john@example.com", "Password123!")]
    [InlineData("John", "Doe", "", "Password123!")]
    [InlineData("John", "Doe", "john@example.com", "")]
    [InlineData("John", "Doe", "invalid-email", "Password123!")]
    public async Task RegisterUser_WithInvalidData_ReturnsBadRequest(
        string firstName, 
        string lastName, 
        string email, 
        string password)
    {
        // Arrange
        var registerUserDto = new RegisterUserDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Password = password
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerUserDto);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task LoginUser_ValidCredentials_ReturnsOk()
    {
        var loginRequest = new LoginDto
        {
            Email = "test@example.com",
            Password = "Test1234!"
        };
        
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("gfj@gmdfs.com", "")]
    [InlineData("test@example.com", "fdjsfg!")]
    public async Task LoginUser_WithInvalidCredentials_ReturnsBadRequest(string email, string password)
    {
        var loginRequest = new LoginDto
        {
            Email = email,
            Password = password
        };
        
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
    
    
}