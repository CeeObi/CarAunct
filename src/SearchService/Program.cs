using System.Net;
using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService.Consumer;
using SearchService.Data;
using SearchService.Services;
// using SearchService.Model;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient<AuctionServiceHttpClient>().AddPolicyHandler(GetPolicy());
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x =>
            {
                x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();//declared here to help download to the consumer folder
                x.AddConsumersFromNamespaceContaining<AuctionUpdatedConsumer>();
                x.AddConsumersFromNamespaceContaining<AuctionDeletedConsumer>();
                x.AddConsumersFromNamespaceContaining<AuctionFinishedConsumer>();
                x.AddConsumersFromNamespaceContaining<BidPlacedConsumer>();
                x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search",false));

                x.UsingRabbitMq((context,cfg) =>
                {
                    // cfg.Host("localhost", "/", h => {
                    //     h.Username("guest");
                    //     h.Password("guest");
                    // }); 
                    cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host => {
                        host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
                        host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
                    });


                    cfg.ReceiveEndpoint("search-auction-created", e => {
                        e.UseMessageRetry(rtry => rtry.Interval(5, 5));
                        e.ConfigureConsumer<AuctionCreatedConsumer>(context);
                    });

                    cfg.ReceiveEndpoint("search-auction-updated", e => {
                        e.UseMessageRetry(rtry => rtry.Interval(5, 5));
                        e.ConfigureConsumer<AuctionUpdatedConsumer>(context);
                    });

                    cfg.ReceiveEndpoint("search-auction-deleted", e => {
                        e.UseMessageRetry(rtry => rtry.Interval(5, 5));
                        e.ConfigureConsumer<AuctionDeletedConsumer>(context);
                    });  
                        
                    cfg.ConfigureEndpoints(context);

                });
            });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Lifetime.ApplicationStarted.Register(async () => {
    /////Moved to DbInitializer class in Data folder
// await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(builder.Configuration.GetConnectionString("MongoDbDefaultConnection")) );
// await DB.Index<Item>()
//     .Key(x => x.Make, KeyType.Text)
//     .Key(x => x.Model, KeyType.Text)
//     .Key(x => x.Color, KeyType.Text)
//     .CreateAsync();
///////////////
    try
    {
        await DbInitializer.InitDb(app);
    }
    catch (Exception e)
    {
        
        Console.WriteLine(e); 
    }
});




app.Run();


//Policy Handler
static IAsyncPolicy<HttpResponseMessage> GetPolicy() => HttpPolicyExtensions
                                                        .HandleTransientHttpError()
                                                        .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
                                                        .WaitAndRetryForeverAsync(_=> TimeSpan.FromSeconds(3));
