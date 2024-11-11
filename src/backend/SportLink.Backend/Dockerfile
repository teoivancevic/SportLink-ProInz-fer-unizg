# Use the .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy the solution and project files
COPY ["SportLink.Backend.sln", "./"]
COPY ["SportLink.API/SportLink.API.csproj", "SportLink.API/"]
COPY ["SportLink.Core/SportLink.Core.csproj", "SportLink.Core/"]

# Restore dependencies
RUN dotnet restore "SportLink.Backend.sln"

# Copy the rest of the application code
COPY . ./

# Build and publish the application
RUN dotnet publish "SportLink.API/SportLink.API.csproj" -c Release -o out

# Use the ASP.NET runtime image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published output from the build step
COPY --from=build-env /app/out .

# Expose the port your application listens on (adjust if necessary)
EXPOSE 8080

# Set environment variables
# ENV ASPNETCORE_URLS=http://+:8080
# ENV ASPNETCORE_HTTPS_PORT=
ENV ASPNETCORE_ENVIRONMENT=Development

# Set the entry point for the container
ENTRYPOINT ["dotnet", "SportLink.API.dll"]

