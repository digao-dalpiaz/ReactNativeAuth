using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend.Handlers
{
    public class Auth
    {

        public static void ConfigureAuth(WebApplicationBuilder builder)
        {
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = Constants.GetConfigValue("AUTH_ISSUER"),
                        ValidAudience = Constants.GetConfigValue("AUTH_APP_ID"),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.GetConfigValue("AUTH_SECRET"))),
                        ClockSkew = TimeSpan.FromMinutes(30)
                    };
                });
        }

    }
}
