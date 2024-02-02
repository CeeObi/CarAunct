using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Model;

namespace SearchService.Consumer;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper;
    public AuctionCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("--> Consuming auctionCreated: " + context.Message.Id);
        var item = _mapper.Map<Item>(context.Message);
        await item.SaveAsync();
    }
}
