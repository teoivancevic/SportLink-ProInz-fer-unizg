// using System.Security.Cryptography;

using System.Reflection;
using System.Text;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SportLink.API.Data;
using SportLink.API.Services.Auth;
using SportLink.API.Services.Email;
using SportLink.API.Services.Organization;
using SportLink.API.Services.OTPCode;
using SportLink.API.Services.Search;
using SportLink.API.Services.Review;

using SportLink.API.Services.Sports;

using SportLink.API.Services.SportCourt;
using SportLink.API.Services.Tournament;
using SportLink.API.Services.TrainingGroup;

using SportLink.API.Services.User;
using SportLink.Core.Handlers;
using SportLink.Core.Helpers;
using SportLink.Core.Models;

var logger = LoggerFactory.Create(config =>
{
    config.AddConsole();
}).CreateLogger("Program");

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});


builder.Services.AddEndpointsApiExplorer();

var xmlDocsPath = Path.Combine(AppContext.BaseDirectory, typeof(Program).Assembly.GetName().Name + ".xml");
builder.Services.AddSwaggerGen(c =>
  {
      c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
      c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
      {
          Description = @"JWT Authorization header using the Bearer scheme. 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      Example: 'Bearer 12345abcdef'",
          Name = "Authorization",
          In = ParameterLocation.Header,
          Type = SecuritySchemeType.ApiKey,
          Scheme = "Bearer"
      });

      c.AddSecurityRequirement(new OpenApiSecurityRequirement()
        {
          {
            new OpenApiSecurityScheme
            {
              Reference = new OpenApiReference
                {
                  Type = ReferenceType.SecurityScheme,
                  Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

              },
              new List<string>()
            }
          });
      c.IncludeXmlComments(xmlDocsPath);
      c.EnableAnnotations();
      
  });



builder.Services.AddControllers();

builder.Services.AddAuthentication("cookie")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    })
    .AddCookie("cookie")
    .AddGoogle(options =>
    {
        options.SignInScheme = "cookie";
        options.ClientId = builder.Configuration["Google:ClientId"]!;
        options.ClientSecret = builder.Configuration["Google:ClientSecret"]!;
        options.CallbackPath = new PathString("/signin-google");
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("jwt_policy", pb => pb
        .RequireAuthenticatedUser()
        .AddAuthenticationSchemes("Bearer")
        .Build()
    );
});


builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// builder.Services.RegisterApiServices(builder.Configuration.GetSection("Jwt:Key").Value);

builder.Services.AddHttpClient();


#region Validation

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<LoginValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserValidator>();

#endregion


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOrganizationService, OrganizationService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOTPCodeService, OTPCodeService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ISearchService<TournamentSearchDto, TournamentSearchParameters>, TournamentSearchService>();
builder.Services.AddScoped<ISearchService<TrainingGroupSearchDto, TrainingGroupSearchParameters>, TrainingGroupSearchService>();
builder.Services.AddScoped<ISearchService<SportObjectSearchDto, SearchParameters>, SportObjectSearchService>();

builder.Services.AddScoped<ISportService, SportService>();

builder.Services.AddScoped<ISportCourtService, SportCourtService>();
builder.Services.AddScoped<ITrainingGroupService, TrainingGroupService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();


builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IAuthHandler, AuthHandler>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<IMapper, Mapper>();


// Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
// Console.WriteLine($"AppPassword: {builder.Configuration["EmailSettings:AppPassword"]}");

var app = builder.Build();

// Apply migrations automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    try
    {
        logger.LogInformation("Starting database migration...");
        if (db.Database.IsRelational())
        {
            db.Database.Migrate();
        }
        logger.LogInformation("Database migrated successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database");
        throw;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.EnableTryItOutByDefault();
    });
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll"); // changed this to be after httpsredirection

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

logger.LogInformation("Application starting...");
logger.LogInformation($"Environment: {app.Environment.EnvironmentName}");

app.Run();

public partial class Program { }
