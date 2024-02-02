using SearchService.Model;
using MongoDB.Driver;
using MongoDB.Entities;
// using System.Text.Json;
using SearchService.Services;

namespace SearchService.Data;

public class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        await DB.InitAsync("SearchDb", MongoClientSettings
            .FromConnectionString(app.Configuration.GetConnectionString("MongoDbDefaultConnection")) );

        await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .CreateAsync();

        var count = await DB.CountAsync<Item>();
    //    if (count==0)
    //    {
    //         Console.WriteLine("no data - will attempt to seed");
    //         var itemData = await File.ReadAllTextAsync("Data/auctions.json");
    //         var options = new JsonSerializerOptions {PropertyNameCaseInsensitive=true};
    //         var newitems = JsonSerializer.Deserialize<List<Item>>(itemData, options);
    //         await DB.SaveAsync(newitems);
    //     }
        using var scope = app.Services.CreateScope();

        var http_client = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();

        var items = await http_client.GetItemsForSearchDb();
            
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
