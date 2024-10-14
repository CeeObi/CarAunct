"use server";

export async function startService() {
    console.log("Starting multiple services");
    const urls = ["https://search-svc.onrender.com", "https://idnttyy-svc-latest.onrender.com"];

    // Array of fetch requests
    const requests = urls.map((url) =>
        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
    );

    try {
        // Use Promise.all to wait for all requests to complete
        const responses = await Promise.all(requests);

        // Parse all responses as JSON
        const data = await Promise.all(responses.map((response) => response.json()));

        console.log("All requests completed successfully:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error occurred while making requests:", error);
        throw error; // Rethrow error if you want it to propagate
    }
}
