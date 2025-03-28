# SportLink.Backend (.NET)

## Instructions for local development
### Secrets for appsettings
You must create a file `appsettings.Development.json` in the `Backend.API/` folder.

The format of the file is at the bottom of this README.

### Database information

Info: This is the database setup:
```
**Development Database** (for local development):
Server: sql-sportlink-test-03.database.windows.net
Database: db-sportlink-dev-03

**Test Database**:
Server: sql-sportlink-test-03.database.windows.net
Database: db-sportlink-test-03
```

> [!NOTE]  
> Ask project lead for connection credentials.
> For the Production db, YOU need to send your public ip to be put on the whitelisted IPs
> - https://www.whatismyip.com/

#### Connect to the database with DataGrip
   - Set username and password (Given by project lead as stated above)
   - **Dev database:** jdbc:sqlserver://sql-sportlink-test-03.database.windows.net:1433;database=db-sportlink-dev-03;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
   - **Test database:** jdbc:sqlserver://sql-sportlink-test-03.database.windows.net:1433;database=db-sportlink-test-03;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;

### Apply DB migrations from backend code
ALL migrations are executed autimatically when running code, so manual running of database update is **NOT NECESSARY anymore**.

For manual application of migrations (if needed for some reason):
#### Visual Studio
1. Open Package Manager Console
2. Enter command `Update-Database`

### .NET CLI

If not installed EF migration tool
```ps
dotnet tool install --global dotnet-ef
```

Run migrations in `SportLink.API` folder:
```ps
dotnet ef database update
```

#### Rider
1. Right click the Backend.API project
2. Select EntityFramework > Update Database
---
3. When you go back to DataGrip and refresh it you should see tables in the public schema


## Instructions for project lead to send credentials
1. In Azure add whitelisted IP to SQL server for Production db
2. Send database credentials messaage format:
   ```
   Username:
   {username}
   Password:
   {password}
   ```
3. Send `appsettings.Development.json` file content:
   ```
   {
      {
      "ConnectionStrings": {
         "DefaultConnection": "..."
      },
      "EmailSettings": {
         "AppPassword": "..."
      },
      "Jwt": {
         "Key": "..."
      },
      "Google": {
         "ClientId": "...",
         "ClientSecret": "..."
      }
   }
   ```