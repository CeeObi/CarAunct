using MongoDB.Entities;

namespace SearchService.Model;

public class Item : Entity //has same properties as the Auction DTO but derieved from mgDb class called Entity which provides its own id, hence no id property.
{
    public int ReservePrice {get; set;}
    public string Seller {get; set;}
    public string Winner {get; set;}
    public int SoldAmount {get; set;}
    public int CurrentHighBid {get; set;}
    public DateTime CreatedAt {get; set;}
    public DateTime UpdatedAt {get; set;}
    public DateTime AuctionEnd {get; set;}
    public string Status {get; set;}
    public string Make {get; set;}
    public string Model {get; set;}
    public string Color {get; set;}
    public int Year {get; set;}
    public int Mileage {get; set;}
    public string ImageUrl {get; set;}
}
