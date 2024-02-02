using AuctionService.Data;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;

namespace AuctionService;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private readonly AuctionDbContext _dbContext;

    public AuctionFinishedConsumer(AuctionDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("--> Consuming auction finished: ");
        
        var auctions = await _dbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId)); //Access auctions from db using Id from consumer message.

        if  (context.Message.ItemSold)
        {
            auctions.Winner = context.Message.Winner;
            auctions.SoldAmount = context.Message.Amount;
        }

        auctions.Status = auctions.SoldAmount > auctions.ReservePrice ? Status.Finished : Status.ReserveNotMet;
        await _dbContext.SaveChangesAsync();
    }
}
