using System.Text.Json.Serialization;
using CreativeScienceTournament.Auth;
using CreativeScienceTournament.Data;
using CreativeScienceTournament.Services;
using CreativeScienceTournament.Support.Auth;
using CreativeScienceTournament.Support.Sorting;
using Microsoft.OpenApi.Models;
using Sieve.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.RegisterAuthSupport();
builder.Services.RegisterSortingSupport();

builder.Services.RegisterPersistence(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.RegisterAuth();
builder.Services.RegisterServices();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CreativeScienceTournament", Version = "v1" });
});

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<SieveProcessor>();
builder.Services.AddMemoryCache();

builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
    app.UseHttpLogging();
// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
app.UseHsts();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseRouting();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    "default",
    "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

try
{
    await AuthSeeder.SeedRoles(app.Services);
    await AuthSeeder.SeedAdmin(app.Services, builder.Configuration);
}
catch (Exception error)
{
    Console.WriteLine("Error seeding roles and admin: " + error.Message);
}

app.Run();