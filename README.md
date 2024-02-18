# ReactNativeAuth
React Native app with OAuth2

Stack:
- Database: MySql 8
- Frontend: React Native with Expo
- Backend: .NET Core 8
- OAuth: FusionAuth

## Mobile App

Create a ".env" file in "app" folder:

```
EXPO_PUBLIC_AUTH_CLIENT_ID=...
EXPO_PUBLIC_AUTH_URL=http://a.b.c.d:9011
EXPO_PUBLIC_BACKEND_URL=http://a.b.c.d:nnnn
```

## Backend (.NET Core 8)

Create a "appsettings.Development.json" in "backend" folder:

```
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "DB_STRING": "Server=host;Database=database_name;Uid=user;Pwd=password",
  "AUTH_ISSUER": "...",
  "AUTH_APP_ID": "...",
  "AUTH_SECRET": "..."
}
```
