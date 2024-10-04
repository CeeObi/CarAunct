using SearchService.Model;
using MongoDB.Driver;
using MongoDB.Entities;
// using System.Text.Json;
using SearchService.Services;

namespace SearchService.Data;

public class DbInitializer
{   
    //Method to initialize Db
    public static async Task InitDb(WebApplication app)
    {
        var connStr = app.Configuration.GetConnectionString("MongoDbDefaultConnection");
        using var scope = app.Services.CreateScope();
        AuctionServiceHttpClient auntnHttpClientService = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();
        await SeedData(connStr, auntnHttpClientService);
    }


    public static async Task SeedData(string cnctStr, AuctionServiceHttpClient auctionServiceHttpClient)
    {   
        
        //Initialize MongoDB with Table named 'SearchDb' from connection string and mongoclientsetting
        await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(cnctStr)); //Globally accessible after initialization
        //Set up fields in MongoDb - columns - make,mode,color
        await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .CreateAsync();

        // var count = await DB.CountAsync<Item>();
    //    if (count==0)
    //    {
    //         Console.WriteLine("no data - will attempt to seed");
    //         var itemData = await File.ReadAllTextAsync("Data/auctions.json");
    //         var options = new JsonSerializerOptions {PropertyNameCaseInsensitive=true};
    //         var newitems = JsonSerializer.Deserialize<List<Item>>(itemData, options);
    //         await DB.SaveAsync(newitems);
    //     }        

        var items = await auctionServiceHttpClient.GetItemsForSearchDb();
            
        Console.WriteLine(items.Count + " returned from the auction server." );            
        
        if (items.Count > 0) 
        {
            // var itemData = await File.ReadAllTextAsync("Data/auctions.json");
            // var options = new JsonSerializerOptions {PropertyNameCaseInsensitive=true};
            // var items = JsonSerializer.Deserialize<List<Item>>(itemData, options);
            await DB.SaveAsync(items);
        }
    }
   
}
