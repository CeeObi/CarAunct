using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
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

app.MapHub<NotificationHub>("/notifications");
app.MapControllers();

app.Run();
