# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the solution and project files
COPY ["SportLink.Backend.sln", "./"]
COPY ["SportLink.API/SportLink.API.csproj", "SportLink.API/"]
COPY ["SportLink.Core/SportLink.Core.csproj", "SportLink.Core/"]

# Restore dependencies
RUN dotnet restore

# Copy the rest of the application code
COPY . .

# Build and publish the application
RUN dotnet publish "SportLink.API/SportLink.API.csproj" -c Release -o /app/publish

# Stage 2: Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the published application from the build stage
COPY --from=build /app/publish .

# Expose the application on port 8080
EXPOSE 8080

# Set environemnt variables
ENV ASPNETCORE_ENVIRONMENT=Development

# Start the application
ENTRYPOINT ["dotnet", "SportLink.API.dll"]

