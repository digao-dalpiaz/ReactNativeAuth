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

        public static async Task WriteOnDb(HttpContext context, string tipo, string info)
        {
            try
            {
                using (var con = await DatabaseUtils.GetConnection())
                {
               
                    await DatabaseUtils.ExecSql(con,
                        "insert into log (date_time, kind, ip, method, url, info, trace_id, backend_version, app_version, os_version)" +
                        " values (CURRENT_TIME, @kind, @ip, @method, @url, @info, @trace_id, @backend_version, @app_version, @os_version)",
                        [
                            ("@ip", context.Connection.RemoteIpAddress?.ToString()),
                            ("@method", context.Request.Method),
                            ("@url", context.Request.Path.ToString()),
                            ("@kind", tipo),
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
