using Microsoft.AspNetCore.Mvc;


namespace SearchService.Controllers;

[ApiController]
[Route("/api")]
public class SearchHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetSearchHome()
    {   


        // var query = await _context.Auctions
        //     .Include(x => x.Item)
        //     .OrderBy(X => X.Item.Make)
        //     .ToListAsync();
        
        // return _mapper.Map<List<AuctionDto>>(query);
        return Content("Search service is listening...");
    }

    
}