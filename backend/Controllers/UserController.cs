using backend.DTOs;
using backend.Exceptions;
using io.fusionauth;
using io.fusionauth.domain.api;
using io.fusionauth.domain.api.user;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        private async static Task<string> GetToken(HttpContext context)
        {
            return await context.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");
        }

        private static FusionAuthClient GetFusionAuthClient()
        {
            return new FusionAuthClient(Constants.GetConfigValue("AUTH_API_KEY"), Constants.GetConfigValue("AUTH_URL"));
        }

        private static void ValidateResponse<T>(ClientResponse<T> response)
        {
            if (!response.WasSuccessful())
            {
                throw new Exception("Error from auth service: " + JsonConvert.SerializeObject(response));
            }
        }

        [HttpPost("ChangeUserData")]
        public async Task ChangeUserData(ChangeUserDataDTO dto)
        {
            var token = await GetToken(HttpContext);
            var id = Guid.Parse(new JwtSecurityTokenHandler().ReadJwtToken(token).Subject);

            UserRequest userRequest = new();
            userRequest.user = new();
            userRequest.user.email = dto.Email.Trim();
            userRequest.user.fullName = dto.Name.Trim();

            var client = GetFusionAuthClient();
            var response = await client.UpdateUserAsync(id, userRequest);
            ValidateResponse(response);
        }

        [HttpPost("ChangePassword")]
        public async Task<string> ChangePassword(ChangePasswordDTO dto)
        {
            var token = await GetToken(HttpContext);
            var email = new JwtSecurityTokenHandler().ReadJwtToken(token).Claims.First(claim => claim.Type == "email").Value;

            var client = GetFusionAuthClient();

            ForgotPasswordRequest forgot = new();
            forgot.sendForgotPasswordEmail = false;
            forgot.email = email;

            var respForgot = await client.ForgotPasswordAsync(forgot);
            ValidateResponse(respForgot);

            ChangePasswordRequest request = new();
            request.changePasswordId = respForgot.successResponse.changePasswordId;
            request.currentPassword = dto.CurrentPassword;
            request.password = dto.NewPassword;

            var respChange = await client.ChangePasswordAsync(null, request);
            if (respChange.statusCode == 404) throw new Validation("Incorrect current password");
            ValidateResponse(respChange);

            LoginRequest loginRequest = new();
            loginRequest.oneTimePassword = respChange.successResponse.oneTimePassword;
            loginRequest.applicationId = Guid.Parse(Constants.GetConfigValue("AUTH_APP_ID"));

            var respLogin = await client.LoginAsync(loginRequest);
            ValidateResponse(respLogin);

            string refreshToken = respLogin.successResponse.refreshToken;
            if (string.IsNullOrEmpty(refreshToken)) throw new Exception("Refresh token not retrieved from login (maybe Generate refresh token is disabled in Application config)");
            return refreshToken;
        }

    }
}
