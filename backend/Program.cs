using backend;
using backend.DbMigration;
using backend.Handlers;

UnhandledEx.Setup();

var builder = WebApplication.CreateBuilder(args);

Constants.InitConfig(builder.Configuration);

new MigrationEngine().Run(); //run db migrations

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

Auth.ConfigureAuth(builder);

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseCustomMiddleware(); //RequestHandler

ExceptionHandler.ConfigureExceptionHandler(app);

app.Run();
