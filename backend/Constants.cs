namespace backend
{
    public class Constants
    {

        public const string BACKEND_VERSION = "1.0.0";

        private static ConfigurationManager _configuration;
        public static string DB_STRING { get; private set; }

        public static void InitConfig(ConfigurationManager configuration)
        {
            _configuration = configuration;

            DB_STRING = GetConfigValue("DB_STRING");
        }

        public static string GetConfigValue(string name)
        {
            var value = _configuration.GetValue<string>(name);
            if (string.IsNullOrEmpty(value)) throw new Exception($"Configuration '{name}' not defined");
            return value;
        }

    }
}
