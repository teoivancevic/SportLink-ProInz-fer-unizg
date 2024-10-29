# SportLink.Backend (.NET + ?)

1. Install Docker

2. Run the command below to create a local postgres database

```bash
docker run --name SportLink-postgres \
  -e POSTGRES_PASSWORD=SecretLocalPwd123 \
  -e POSTGRES_DB=SportLinkLocalDb \
  -p 5432:5432 \
  -d postgres
```

3. Open the solution in your IDE and run it :)
