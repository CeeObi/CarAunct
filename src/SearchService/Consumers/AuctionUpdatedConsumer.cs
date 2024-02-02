using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Model;

namespace SearchService.Consumer;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine("--> Consuming auctionUpdated: " + context.Message.Id);

        await DB.Update<Item>()
        .MatchID(context.Message.Id)
        .Modify(b => b.Make, context.Message.Make)
        .Modify(b => b.Model, context.Message.Model)
        .Modify(b => b.Color, context.Message.Color)
        .Modify(b => b.Mileage, context.Message.Mileage)
        .Modify(b => b.Year, context.Message.Year)
        .ExecuteAsync();
    }
}
