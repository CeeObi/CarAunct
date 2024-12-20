using AuctionService;
using AuctionService.Data;
using AuctionService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add environment variables to the configuration
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddControllers();
//Add Db to IOC
builder.Services.AddDbContext<AuctionDbContext>(options => 
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMassTransit(x =>
            {
                x.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
                {
                    o.QueryDelay = TimeSpan.FromSeconds(10);
                    o.UsePostgres();
                    o.UseBusOutbox();
                });

                x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();//ConsumesFaultfromRabbitmq
                x.AddConsumersFromNamespaceContaining<AuctionFinishedConsumer>();
                x.AddConsumersFromNamespaceContaining<BidPlacedConsumer>();
                x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction",false));

                x.UsingRabbitMq((context,cfg) =>
                {
                    cfg.Host(new Uri(builder.Configuration["RabbitMq:Host"]));
                    // cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host => {
                    //     host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
                    //     host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
                    // });

                    // cfg.ConfigureEndpoints(context);
                });
            });
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => 
{
    options.Authority = builder.Configuration["IdentityServiceUrl"];
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters.ValidateAudience = false;
    options.TokenValidationParameters.NameClaimType = "username";
});

builder.Services.AddGrpc();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGrpcService<GrpcAuctionService>();

try
{
    DbInitializer.InitDb(app);
}
catch (Exception e)
{    
    Console.WriteLine(e);
}

app.Run();
