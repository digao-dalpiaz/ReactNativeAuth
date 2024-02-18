using System.Text;

namespace backend.Services
{
    public class LogService
    {

        public static void LogException(Exception ex, string tipo)
        {
            StringBuilder sb = new();

            var currentEx = ex;

            while (currentEx != null)
            {
                sb.AppendLine(currentEx.Message + "\n" + currentEx.StackTrace);

                currentEx = currentEx.InnerException;
            }

            string errorsFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "errors.txt");

            File.AppendAllText(errorsFile,
                "\n" +
                DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " - " + tipo + "\n" +
                sb.ToString());
        }

        public static async Task WriteOnDb(HttpContext context, string kind, string info)
        {
            var endpointParams = string.Join("/", context.GetRouteData().Values
                .Where(x => x.Key != "controller" && x.Key != "action")
                .Select(x => x.Key + ":" + x.Value.ToString()));

            var endpoint = context.GetEndpoint();
            if (endpoint == null) { //when called from ExceptionHandler, endpoint is null
                if (!context.Items.TryGetValue("__OriginalEndpoint", out var objEp)) throw new Exception("Could not get original endpoint");
                endpoint = (Endpoint)objEp;
            }

            try
            {
                using (var con = await DatabaseUtils.GetConnection())
                {
                    await DatabaseUtils.ExecSql(con,
                        "insert into log (date_time, kind, ip, method, endpoint, params, query, info, trace_id, backend_version, app_version, os_version)" +
                        " values (CURRENT_TIME, @kind, @ip, @method, @endpoint, @params, @query, @info, @trace_id, @backend_version, @app_version, @os_version)",
                        [
                            ("@ip", context.Connection.RemoteIpAddress?.ToString()),
                            ("@method", context.Request.Method),
                            ("@endpoint", ((RouteEndpoint)endpoint).RoutePattern.RawText),
                            ("@params", endpointParams),
                            ("@query", context.Request.QueryString),
                            ("@kind", kind),
                            ("@info", info),
                            ("@trace_id", context.TraceIdentifier),
                            ("@backend_version", Constants.BACKEND_VERSION),
                            ("@app_version", context.Request.Headers["appVersion"]),
                            ("@os_version", context.Request.Headers["osVersion"])
                        ]
                    );
                }
            }
            catch (Exception ex)
            {
                LogException(ex, "Error writing log on database");
                throw;
            }
        }

    }
}
