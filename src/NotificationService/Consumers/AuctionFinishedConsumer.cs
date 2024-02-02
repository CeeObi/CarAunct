using MassTransit;
using Microsoft.AspNetCore.SignalR;

namespace NotificationService;

public class AuctionFinishedConsumer : IConsumer<AuctionFinishedConsumer>
{
    private readonly IHubContext<NotificationHub> _hubContext;
    public AuctionFinishedConsumer(IHubContext<NotificationHub> hubContext )
    {
        _hubContext = hubContext;
    }
    public async Task Consume(ConsumeContext<AuctionFinishedConsumer> context)
    {
        Console.WriteLine("--> Auction finished notification message received");
        await _hubContext.Clients.All.SendAsync("AuctionFinished", context.Message);
    }
}

