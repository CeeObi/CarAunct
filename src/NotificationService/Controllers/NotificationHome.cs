using Microsoft.AspNetCore.Mvc;


namespace NotificationService.Controllers;

[ApiController]
[Route("/")]
public class NotificationHome : ControllerBase
{

    [HttpGet]
    public IActionResult GetNotificationHome()
    {   
        return Content("Notification service is listening...");
    }

    
}