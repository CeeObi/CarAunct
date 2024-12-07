// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.


using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IdentityService.Pages;

public class SecurityHeadersAttribute : ActionFilterAttribute
{
    public override void OnResultExecuting(ResultExecutingContext context)
    {
        var result = context.Result;
        if (result is PageResult)
        {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
            if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Type-Options"))
            {
                context.HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
            }

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
            if (!context.HttpContext.Response.Headers.ContainsKey("X-Frame-Options"))
            {
                context.HttpContext.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
            }

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
            var csp = "default-src 'self'; object-src 'none'; frame-ancestors 'none'; sandbox allow-forms allow-same-origin allow-scripts; base-uri 'self';";
            // also consider adding upgrade-insecure-requests once you have HTTPS in place for production
            csp += "upgrade-insecure-requests;";
            // also an example if you need client images to be displayed from twitter
            // csp += "img-src 'self' https://pbs.twimg.com;";
            // once for standards compliant browsers
            if (!context.HttpContext.Response.Headers.ContainsKey("Content-Security-Policy"))
            {
                context.HttpContext.Response.Headers.Add("Content-Security-Policy", csp);
            }
            // and once again for IE
            if (!context.HttpContext.Response.Headers.ContainsKey("X-Content-Security-Policy"))
            {
                context.HttpContext.Response.Headers.Add("X-Content-Security-Policy", csp);                
            }

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
            var referrer_policy = "no-referrer";
            if (!context.HttpContext.Response.Headers.ContainsKey("Referrer-Policy"))
            {
                context.HttpContext.Response.Headers.Add("Referrer-Policy", referrer_policy);                
            }
            if (!context.HttpContext.Response.Headers.ContainsKey("Strict-Transport-Security"))
            {
                context.HttpContext.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");               
            }

        }
    }

    public override void OnResultExecuted(ResultExecutedContext context)
    {
        // Log the response body
        var response = context.HttpContext.Response;

        // Backup the original response body stream
        var originalBodyStream = response.Body;

        try
        {
            // Create a memory stream to temporarily hold the response body
            using (var memoryStream = new MemoryStream())
            {
                // Replace the response body with our memory stream
                response.Body = memoryStream;

                // Execute the next middleware or result
                base.OnResultExecuted(context);

                // Reset the memory stream position to the beginning to read the content
                memoryStream.Seek(0, SeekOrigin.Begin);

                // Read the content as text
                var responseBody = new StreamReader(memoryStream).ReadToEnd();

                // Log the response body (you can replace this with your logging mechanism)
                LogResponseBody(responseBody);

                // Reset the memory stream position again before writing back to the original stream
                memoryStream.Seek(0, SeekOrigin.Begin);

                // Copy the content back to the original response stream
                memoryStream.CopyTo(originalBodyStream);
            }
        }
        finally
        {
            // Restore the original response body stream
            response.Body = originalBodyStream;
        }
    }

    private void LogResponseBody(string responseBody)
    {
        // Your logging logic goes here, e.g., log to file or console
        Console.WriteLine("Response Body: ");
        Console.WriteLine(responseBody);
    }
}