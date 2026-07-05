using Microsoft.EntityFrameworkCore;
using backend.Data;

var builder=WebApplication.CreateBuilder(args);

//Configurar banco de dados (SQL lite)
var connectionString=builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options=>
    options.UseSqlite(connectionString));


//Configuração do CORS
builder.Services.AddCors(options=>
{
    options.AddPolicy("Desenvolvimento", policy =>
    {
        policy.WithOrigins("http://localhost:5173","http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        var enumConverter = new System.Text.Json.Serialization.JsonStringEnumConverter(
            namingPolicy: null,
            allowIntegerValues: true
        );
        options.JsonSerializerOptions.Converters.Add(enumConverter);
    });
builder.Services.AddOpenApi();

var app=builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

}

app.UseCors("Desenvolvimento");
// app.UseAuthorization();
app.MapControllers();

app.Run();