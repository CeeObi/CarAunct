using Microsoft.AspNetCore.Mvc;


namespace AuctionService.Controllers;

[ApiController]
[Route("/api")]
public class AuctionHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetAuctionHome()
    {   


        // var query = await _context.Auctions
        //     .Include(x => x.Item)
        //     .OrderBy(X => X.Item.Make)
        //     .ToListAsync();
        
        // return _mapper.Map<List<AuctionDto>>(query);
        return Content("Auction service is listening...");
    }

    
}