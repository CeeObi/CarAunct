﻿using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _dbContext;

    public BidPlacedConsumer(AuctionDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Consuming bid placed: ");

        var auctions = await _dbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId));

        if (auctions.CurrentHighBid == null || context.Message.BidStatus.Contains("Accepted") && context.Message.Amount > auctions.CurrentHighBid)
        {
            auctions.CurrentHighBid = context.Message.Amount;
            await _dbContext.SaveChangesAsync();
        }
    }
}
