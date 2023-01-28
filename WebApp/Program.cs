using System.Text.Json.Serialization;
using Hangfire;
using Microsoft.OpenApi.Models;
using RazorEmails.Services;
using WebApp.Auth;
using WebApp.Data;
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
app.UseRouting();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    "default",
    "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

await AuthSeeder.SeedRoles(app.Services);
await AuthSeeder.SeedAdmin(app.Services, builder.Configuration);

app.Run();