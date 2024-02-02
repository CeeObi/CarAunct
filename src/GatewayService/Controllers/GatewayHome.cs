using Microsoft.AspNetCore.Mvc;


namespace GatewayService.Controllers;

[ApiController]
[Route("/api")]
public class GatewayHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetGatewayHome()
    {   
        return Content("Gateway service is listening...");
    }

    
}