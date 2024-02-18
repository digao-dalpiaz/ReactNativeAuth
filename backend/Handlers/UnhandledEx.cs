using backend.Services;

namespace backend.Handlers
{
    public class UnhandledEx
    {

        public static void Setup()
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
            {
                LogService.LogException((Exception)e.ExceptionObject, "Unhandled exception");
            };
        }

    }
}
