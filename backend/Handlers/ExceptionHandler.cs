using backend.Exceptions;
using backend.Services;
using Microsoft.AspNetCore.Diagnostics;
using System.Text;

namespace backend.Handlers
{
    public class ExceptionHandler
    {
        public static void ConfigureExceptionHandler(WebApplication app)
        {
            app.UseExceptionHandler(builder =>
            {
                builder.Run(async context =>
                {
                    var ex = context.Features.Get<IExceptionHandlerPathFeature>();

                    if (ex.Error is Validation)
                    {
                        context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
                        await context.Response.WriteAsync(ex.Error.Message);
                    }
                    else
                    {
                        var currentEx = ex.Error;

                        StringBuilder sb = new();

                        while (currentEx != null)
                        {
                            sb.AppendLine(currentEx.Message + "\n" + currentEx.StackTrace);

                            currentEx = currentEx.InnerException;
                        }

                        await LogService.WriteOnDb(context, "ERROR", sb.ToString());
                    }
                });
            });
        }

    }
}
