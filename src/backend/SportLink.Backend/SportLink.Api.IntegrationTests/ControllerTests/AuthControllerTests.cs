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
    
    [Fact]
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