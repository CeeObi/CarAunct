using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;
using MassTransit;

namespace BiddingService;

public class GrpcAuctionClient //: GrpcAuction.GrpcAuctionBase is for the server side
{
    private readonly ILogger _logger;
    private readonly IConfiguration _config;

    public GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
        
    } 
 
    public async Task<Auction> GetAuctionAsync(string id)
    {
            _logger.LogInformation("==> Calling GRPC Service");
            var channel = GrpcChannel.ForAddress(_config["GrpcAuction"]); 
            var client = new GrpcAuction.GrpcAuctionClient(channel);
            var request = new GetAuctionRequest{Id = id};            

            try
            {
                var reply = await client.GetAuctionAsync(request);///Error line
                _logger.LogInformation("RAN COMPLETED THROUGH TEST");

                var auction = new Auction{
                    ID = reply.Auction.Id,
                    AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                    Seller = reply.Auction.Seller,
                    ReservePrice = reply.Auction.ReservePrice
                };                
                return auction;
            }
            catch (Exception ex)
            {                
                _logger.LogError(ex,"Could not call GRPC server");
                return null;
            }
    }
}
