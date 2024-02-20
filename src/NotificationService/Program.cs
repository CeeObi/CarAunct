using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService;

// var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("https://carsbidi.onrender.com/").AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
                      });
});

builder.Services.AddMassTransit(x =>
            {
                x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
                // x.AddConsumersFromNamespaceContaining<AuctionFinishedConsumer>();
                // x.AddConsumersFromNamespaceContaining<BidPlacedConsumer>();

                x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("notification",false));
                x.UsingRabbitMq((context,cfg) =>
                {
                    cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host => {
                        host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
                        host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
                    });
                    cfg.ConfigureEndpoints(context);
                });
            });
 
 
builder.Services.AddSignalR();


var app = builder.Build();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.MapHub<NotificationHub>("/notifications");
app.MapControllers();

app.Run();
