using backend.DTOs;
using backend.Exceptions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {

        private async static Task<(HttpStatusCode, string)> Post(string token, string endpoint, object body)
        {
            using (var client = new HttpClient())
            {
                if (token != null)
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, token);
                }

                var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(Constants.GetConfigValue("AUTH_URL") + endpoint, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                return (response.StatusCode, responseContent);
            }
        }

        [HttpPost("ChangePassword")]
        public async Task ChangePassword(ChangePasswordDTO dto)
        {
            var token = await HttpContext.GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

            var body = new
            {
                currentPassword = dto.CurrentPassword,
                password = dto.NewPassword
            };

            var respChange = await Post(token, "/api/user/change-password", body);

            if (respChange.Item1 != HttpStatusCode.OK)
            {
                if (respChange.Item1 == HttpStatusCode.NotFound)
                {
                    throw new Validation("Incorrect current password");
                }

                Console.WriteLine(respChange.Item2);
                throw new Validation("Error changing password"); //** get error ?
            }
            
            //

            /*
            var bodyRefresh = new
            {
                applicationId = new JwtSecurityTokenHandler().ReadJwtToken(token).Audiences.First(),
                oneTimePassword = JsonConvert.DeserializeObject<dynamic>(respChange.Item2).oneTimePassword.Value
            };

            var respRefresh = await Post(null, "/api/login", bodyRefresh);

            if (respRefresh.Item1 != HttpStatusCode.OK)
            {
                Console.WriteLine(respRefresh.Item2);
                throw new Validation("Error refreshing token"); //**
            }

            Console.WriteLine(respRefresh.Item2);
            return respRefresh.Item2;
            */
        }

    }
}
