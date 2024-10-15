"use server";

import fetch from "node-fetch";

export async function startService() {
    console.log("Starting multiple services");
    const urls = ["https://search-svc.onrender.com", "https://idnttyy-svc-latest.onrender.com"];
    const response = await fetch("https://search-svc.onrender.com", );
    console.log(response);
}
