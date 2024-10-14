"use server";
const urls = ["https://search-svc.onrender.com", "https://idnttyy-svc-latest.onrender.com"];

export async function startService() {
    console.log("Starting multiple services");
    // Array of fetch requests
    const requests = urls.map((url) =>
        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
    );

    // Use Promise.all to wait for all requests to complete
    Promise.all(requests)
        .then((responses) => Promise.all(responses.map((response) => response.json()))) // Parse all responses as JSON
        .then((data) => {
            console.log("All requests completed successfully:", data);
        })
        .catch((error) => {
            console.error("Error occurred while making requests:", error);
        });
}
