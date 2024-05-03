using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;

namespace IdentityService.Pages.Diagnostics;

[SecurityHeaders]
[Authorize]
public class Index : PageModel
{
    public ViewModel View { get; set; }
        
    public async Task<IActionResult> OnGet()
    {   
        var localAddresses = new string[] { "::ffff:172.20.0.1","::ffff:172.18.0.1", "127.0.0.1", "::1", "13.228.225.19","18.142.128.26","54.254.162.138", HttpContext.Connection.LocalIpAddress.ToString() };//previous line for debug claims
        if (!localAddresses.Contains(HttpContext.Connection.RemoteIpAddress.ToString()))
        {
            return NotFound();
        }

        View = new ViewModel(await HttpContext.AuthenticateAsync());
            
        return Page();
    }
}