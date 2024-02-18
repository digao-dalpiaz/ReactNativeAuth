# ReactNativeAuth
React Native app with OAuth2 using FusionAuth

Stack:
- Database: MySql 8
- Frontend: React Native with Expo
- Backend: .NET Core 8
- OAuth: FusionAuth

## How to setup the environment

### FusionAuth

I recommend you to use Docker. Download an image of FusionAuth app and run it.

*FusionAuth requires its own database, supporting PostgreSQL and MySQL. You need to configure database connection settings when running first time.*

The default FusionAuth port is 9011.

Steps in FusionAuth admin:

1. Create an Key Master for JWT token (Settings > Key Master > use Generate HMAC secret in the top-right menu)
2. Create an application, set Client Authentication to "Not required", set Authorized redirect URLs (you can run app once and get this url from error when trying to login).
3. Enable JWT in app and configure Access token signing key to use the Key Master.

Optional: Configure the Issuer in Tenant. The default is "acme.com", but you may change this. The JWT validation in backend is based on Issuer, App ID and Key Master secret.

### MySql Database

Install MySql Server 8 and create a new empty database.

### Mobile App

Create a ".env" file in "app" folder:

```
EXPO_PUBLIC_AUTH_CLIENT_ID={the app id in FusionAuth}
EXPO_PUBLIC_AUTH_URL=http://fusionauth_host:9011
EXPO_PUBLIC_BACKEND_URL=http://backend_host:5258
```

Run "npm install"

Run "npm expo start" 

### Backend (.NET Core 8)

Create a "appsettings.Development.json" in "backend" folder:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "DB_STRING": "Server=host;Database=database_name;Uid=user;Pwd=password",
  "AUTH_ISSUER": "acme.com",
  "AUTH_APP_ID": "{the app id in FusionAuth}",
  "AUTH_SECRET": "{the Master Key secret in FusionAuth}"
}
```

Run application service.

> To run in your phone, install Expo Go app.

**Remember to allow backend and Node in your firewall if running in your phone.**
