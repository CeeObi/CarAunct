using Microsoft.AspNetCore.Mvc;


namespace BiddingService.Controllers;

[ApiController]
[Route("/api")]
public class BidHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetBidHome()
    {   
        return Content("Bidding service is listening...");
    }

    
}