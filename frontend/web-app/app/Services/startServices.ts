"use server";

import fetch from "node-fetch";

export async function startService() {
    console.log("Starting multiple services");
    const urls = ["https://search-svc.onrender.com", "https://idnttyy-svc-latest.onrender.com"];
    const requestOPtions = {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        Accept: "text/html",
    };
    const response = await fetch("https://search-svc.onrender.com", { headers: requestOPtions });
    console.log(response);
}
