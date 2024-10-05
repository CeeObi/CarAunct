using IdentityService.Models;
using IdentityService.Pages;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace IdentityService.Controllers;

[ApiController]
[Route("/api")]
public class IdentityHome : ControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;

    public IdentityHome(SignInManager<ApplicationUser> signInManager)
    {
        _signInManager = signInManager;


    }


    [HttpGet]
    public IActionResult GetIdentityHome()
    {   
        return Content("Identity service is listening...");
    }



    [HttpGet("/api/auth/logout")]
    //[SecurityHeaders]
    public async Task<IActionResult> signOut()
    {
        await _signInManager.SignOutAsync();
        return NoContent();

    }
}
