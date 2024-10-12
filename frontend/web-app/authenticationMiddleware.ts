// middleware.js
import { NextResponse } from "next/server";

export function middleware(request: { nextUrl: { clone: () => any }; headers: { get: (arg0: string) => string } }) {
    const url = request.nextUrl.clone();
    console.log("XXXXXXXXXXXXXXXXXXXXXX");
    console.log(request);
    console.log("XXXXXXXXXXXXXXXXXXXXXX");
    // Check if the request is not secure (HTTP)
    if (request.headers.get("x-forwarded-proto") !== "https") {
        // Change the protocol to HTTPS
        url.protocol = "https";
        return NextResponse.redirect(url); // Redirect to the HTTPS version
    }

    return NextResponse.next(); // Allow the request to proceed
}

export const config = {
    matcher: ["/*"],
};
