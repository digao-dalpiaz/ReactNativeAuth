using backend.Services;
using System.Text;

namespace backend.Handlers
{
    public class RequestHandler(RequestDelegate next)
    {

        public async Task Invoke(HttpContext context)
        {
            if (!context.Request.Path.Equals("/Main/GetVersion", StringComparison.OrdinalIgnoreCase))
            {
                string versao = context.Request.Headers["appVersion"];
                if (string.IsNullOrEmpty(versao)) throw new Exception("App version not informed");

                if (Utils.CompareVersions(versao, "1.0.0") < 0)
                {
                    context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
                    await context.Response.WriteAsync("Unsupported version. Please update your app!");
                    return;
                }
            }

            context.Request.EnableBuffering();

            string body;
            using (var reader = new StreamReader(context.Request.Body, encoding: Encoding.UTF8, leaveOpen: true))
            {
                body = await reader.ReadToEndAsync();
            }
            await LogService.WriteOnDb(context, "REQUEST", body);

            context.Request.Body.Position = 0;
            await next(context);
        }

    }

    public static class RequestHandleExtensions
    {
        public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestHandler>();
        }
    }

}
