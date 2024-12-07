import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Custom HTTPS redirection middleware
export function middleware(request: any) {
    const url = request.nextUrl.clone();

    // Apply HTTPS redirection for all requests to /session
    if (request.headers.get("x-forwarded-proto") !== "https" && request.nextUrl.pathname.startsWith("/session")) {
        url.protocol = "https"; // Change the protocol to HTTPS
        return NextResponse.redirect(url, 301); // Permanent redirect to HTTPS
    }

    // Proceed with the NextAuth.js middleware for other authentication checks
    return withAuth(request);
}

// Config object to apply middleware to specific paths
export const config = {
    matcher: ["/session"], // Apply middleware only to /session
};
