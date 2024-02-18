using MySql.Data.MySqlClient;

namespace backend.Services
{
    public class DatabaseUtils
    {

        public async static Task<MySqlConnection> GetConnection()
        {
            var con = new MySqlConnection(Constants.DB_STRING);
            await con.OpenAsync();
            return con;
        }

        private static void FillParameters(MySqlCommand cmd, List<(string, object)> parameters)
        {
            foreach (var p in parameters)
            {
                cmd.Parameters.AddWithValue(p.Item1, p.Item2);
            }
        }

        public static async Task<List<T>> ReadAsList<T>(MySqlConnection con, string sql, List<(string, object)> parameters)
        {
            var fields = typeof(T).GetProperties();

            List<T> data = [];

            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = sql;
                FillParameters(cmd, parameters);                

                using (var r = await cmd.ExecuteReaderAsync())
                {
                    while (await r.ReadAsync())
                    {
                        T item = Activator.CreateInstance<T>();
                        foreach (var f in fields)
                        {
                            f.SetValue(item, r[f.Name]);
                        }
                        data.Add(item);
                    }
                }
            }

            return data;
        }

        public static async Task<int> ExecSql(MySqlConnection con, string sql, List<(string, object)> parameters)
        {
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = sql;
                FillParameters(cmd, parameters);
                
                return await cmd.ExecuteNonQueryAsync();
            }
        }

        public static async Task<bool> RecordExists(MySqlConnection con, string sql, List<(string, object)> parameters)
        {
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = sql;
                FillParameters(cmd, parameters);

                using (var r = await cmd.ExecuteReaderAsync())
                {
                    return await r.ReadAsync();
                }
            }
        }

        public static async Task<object> SqlScalar(MySqlConnection con, string sql, List<(string, object)> parameters)
        {
            using (var cmd = con.CreateCommand())
            {
                cmd.CommandText = sql;
                FillParameters(cmd, parameters);

                using (var r = await cmd.ExecuteReaderAsync())
                {
                    if (!await r.ReadAsync()) throw new Exception("Record not found");
                    var value = r[0];
                    return value == DBNull.Value ? null : value; 
                }
            }
        }

    }
}
