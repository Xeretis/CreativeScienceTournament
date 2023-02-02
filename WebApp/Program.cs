using System.Text.Json.Serialization;
using Hangfire;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using RazorEmails.Services;
using WebApp.Auth;
using WebApp.Data;
using WebApp.Filters;
using WebApp.Services;
using WebApp.Support.Auth;
using WebApp.Support.Hangfire;
using WebApp.Support.Mail;
using WebApp.Support.Sieve;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.RegisterAuthSupport();
builder.Services.RegisterSieveSupport();
builder.Services.RegisterMailSupport(builder.Configuration);
builder.Services.RegisterHangfireSupport(builder.Configuration.GetConnectionString("DefaultConnection"));


builder.Services.RegisterPersistence(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.RegisterAuth();
builder.Services.RegisterFilters();
builder.Services.RegisterWebAppServices();
builder.Services.RegisterRazorEmailsServices();

builder.Services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApp", Version = "v1" }); });

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddMemoryCache();

builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

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
    app.UseHangfireDashboard();
}

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources/Images")),
    RequestPath = new PathString("/Images")
});

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
catch
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError("An error occurred while seeding the database");
}

app.Run();