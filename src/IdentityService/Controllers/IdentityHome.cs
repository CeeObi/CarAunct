using Microsoft.AspNetCore.Mvc;


namespace IdentityService.Controllers;

[ApiController]
[Route("/api")]
public class IdentityHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetIdentityHome()
    {   
        return Content("Identity service is listening...");
    }

    
}