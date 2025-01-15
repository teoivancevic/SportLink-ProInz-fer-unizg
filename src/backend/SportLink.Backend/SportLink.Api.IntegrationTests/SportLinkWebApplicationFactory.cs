    using System.Data.Common;
    using System.Net.Mime;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc.Testing;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Data.Sqlite;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.DependencyInjection.Extensions;
    using Microsoft.VisualStudio.TestPlatform.TestHost;
    using SportLink.API.Data;
    using SportLink.Api.IntegrationTests.Helpers;

    namespace SportLink.Api.IntegrationTests;

    public class SportLinkWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<DataContext>));
                
                services.AddDbContext<DataContext>(options =>
                {
                    options.UseInMemoryDatabase("SportLinkTestDb").EnableSensitiveDataLogging();
                });
                
                var serviceProvider = services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                
                context.Database.EnsureDeleted();
                Utilities.InitializeDbForTests(context);

                //context.Database.OpenConnection(); 
            });
                    
            
        }
    }