using Microsoft.AspNetCore.Mvc;


namespace NotificationService.Controllers;

[ApiController]
[Route("/api")]
public class NotificationHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetNotificationHome()
    {   
        return Content("Notification service is listening...");
    }

    
}