// using System.Security.Cryptography;

using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SportLink.API.Data;
using SportLink.API.Services.Email;
using SportLink.API.Services.OTPCode;
using SportLink.API.Services.User;
using SportLink.Core.Handlers;
using SportLink.Core.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();


builder.Services.AddEndpointsApiExplorer();

var xmlDocsPath = Path.Combine(AppContext.BaseDirectory, typeof(Program).Assembly.GetName().Name + ".xml");
// builder.Services.AddSwaggerGen(options => { options.IncludeXmlComments(xmlDocsPath); });
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"Bearer {token}\"",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    // options.OperationFilter<SecurityRequirementsOperationFilter>();
    options.IncludeXmlComments(xmlDocsPath);
});

builder.Services.AddControllers();


builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("LocalConnection"));
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
builder.Services.AddScoped<IOTPCodeService, OTPCodeService>();

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IAuthHandler, AuthHandler>();


// Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
// Console.WriteLine($"AppPassword: {builder.Configuration["EmailSettings:AppPassword"]}");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {       
        options.EnableTryItOutByDefault();
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
