using FluentMigrator;

namespace backend.DbMigration.Scripts
{
    [Migration(1)]
    public class Migration0001 : Migration
    {
        public override void Down()
        {
            throw new NotImplementedException();
        }

        public override void Up()
        {
            Create.Table("log")
                .WithColumn("id").AsInt64().PrimaryKey().Identity()
                .WithColumn("date_time").AsDateTime()
                .WithColumn("ip").AsString(100)
                .WithColumn("method").AsString(10)
                .WithColumn("endpoint").AsString(200)
                .WithColumn("params").AsString(500)
                .WithColumn("query").AsString(500)
                .WithColumn("kind").AsString(20)
                .WithColumn("info").AsCustom("TEXT")
                .WithColumn("trace_id").AsString(100)
                .WithColumn("backend_version").AsString(20)
                .WithColumn("app_version").AsString(10)
                .WithColumn("os_version").AsString(10);
        }

    }
}
