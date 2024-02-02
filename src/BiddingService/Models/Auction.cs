using MongoDB.Entities;

namespace BiddingService.Models;

public class Auction : Entity
{
    public DateTime AuctionEnd {set; get;}
    public string Seller { get; set; }
    public int ReservePrice { get; set; }
    public bool Finished { get; set; }

}
