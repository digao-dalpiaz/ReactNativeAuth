# ReactNativeAuth
React Native app with OAuth2

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
  "AUTH_APP_ID": "...",
  "AUTH_SECRET": "..."
}
```
