# SportLink.Backend (.NET + ?)

## Instructions for local development
### Install local database

1. Install Docker
2. Run the command below to create a local postgres database
```bash
docker run --name SportLink-postgres -e POSTGRES_PASSWORD=SecretLocalPwd123 -e POSTGRES_DB=SportLinkLocalDb -p 35432:5432 -d postgres
```
3. Connect to the database with DataGrip
   - Host: host.docker.internal (za linux/mac dovoljno localhost)
   - Port: 35432
   - User: postgres
   - Password: SecretLocalPwd123
   - Database: SportLinkLocalDb
   - URL: (just check that it has the correct info from above)

### Apply DB migrations from backend code

#### Visual Studio
1. Open Package Manager Console
2. Enter command `Update-Database`
#### Rider
1. Right click the Backend.API project
2. Select EntityFramework > Update Database
---
3. When you go back to DataGrip and refresh it you should see tables in the public schema
