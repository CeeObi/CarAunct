using Duende.IdentityServer;
using IdentityService.Data;
using IdentityService.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Security.Cryptography.X509Certificates;

namespace IdentityService;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        // Add environment variables to the configuration
        builder.Configuration.AddEnvironmentVariables();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;
                options.IssuerUri = builder.Configuration["IssuerUri"];


                if (builder.Environment.IsEnvironment("Docker"))
                {
                    options.IssuerUri = "identity-svc";
                }

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                // options.EmitStaticAudienceClaim = true;
            })
            .AddInMemoryIdentityResources(Config.IdentityResources)
            .AddInMemoryApiScopes(Config.ApiScopes)
            .AddInMemoryClients(Config.Clients(builder.Configuration))
            .AddAspNetIdentity<ApplicationUser>()
            .AddProfileService<CustomProfileService>()
            //.AddSigningCredential(new X509Certificate2("path_to_certificate.pfx", "password"))
            ;



        builder.Services.ConfigureApplicationCookie(options => 
        {

            if (builder.Environment.IsDevelopment())
            {
                // Do not set Secure in development
                //options.Cookie.SecurePolicy = CookieSecurePolicy.None;
                //// Optionally, do not set SameSite=None if you're not using HTTPS
                //options.Cookie.SameSite = SameSiteMode.Lax; // Adjust accordingly
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;
            }
            else
            {
                // In production, enforce Secure and SameSite=None for cookies
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;
            }
        }); //Required when using http

        builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builderCors => builderCors
                        .WithOrigins(builder.Configuration["ClientApp"]) // Your Next.js app
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()); // Important for cookie exchange
            });
        
        builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie(options =>
        {
            options.LoginPath = "/Account/Login"; // Adjust paths as needed
            options.LogoutPath = "/Account/Logout";
            if (builder.Environment.IsDevelopment())
            {
                // Do not set Secure in development
                //options.Cookie.SecurePolicy = CookieSecurePolicy.None;
                //// Optionally, do not set SameSite=None if you're not using HTTPS
                //options.Cookie.SameSite = SameSiteMode.Lax; // Adjust accordingly
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;
            }
            else
            {
                // In production, enforce Secure and SameSite=None for cookies
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;
            }
        });

        return builder.Build();
    }
    


    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // Enable forwarded headers to support reverse proxies (like Render)
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        });

        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseSerilogRequestLogging();
    
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors("AllowSpecificOrigin");
        app.UseAuthentication();
        app.UseIdentityServer();
        app.UseAuthorization();
        
        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}