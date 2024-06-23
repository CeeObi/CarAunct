import { getTokenWorkAround } from "@/app/actions/authActions";
import axios from "axios";

const baseUrl = process.env.API_URL;

async function get(url: string, retries = 7, backoff = 3000) {
    const requestOptions = {
        method: "GET",
        headers: await getHeaders(),
    };
    for (let attempt = 0; attempt < retries; attempt++) {
        var res;
        try {
            // const response = await fetch(baseUrl + url, requestOptions);
            const response = await fetch(url, requestOptions);
            console.log("fetch is:", response);
            const customFetch = axios.create(); //{
            //     baseURL: baseUrl,
            // });
            // const resp = customFetch(baseUrl + url, requestOptions);
            const resp = await customFetch(url, requestOptions);
            console.log("axios", resp);

            res = response;
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await handleResponse(response);
        } catch (error) {
            if (attempt < retries - 1) {
                console.log(`Attempt ${attempt + 1} failed. Retrying in ${backoff}ms...`);
                await new Promise((resolve) => setTimeout(resolve, backoff));
                backoff *= 2; // Exponential backoff
            } else {
                return res;
            }
        }
    }
}

async function post(url: string, body: {}, retries = 5, backoff = 3000) {
    const requestOptions = {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(body),
    };
    for (let attempt = 0; attempt < retries; attempt++) {
        var res;
        try {
            // const response = await fetch(baseUrl + url, requestOptions);
            const response = await fetch(url, requestOptions);
            res = response;
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await handleResponse(response);
        } catch (error) {
            if (attempt < retries - 1) {
                console.log(`Attempt ${attempt + 1} failed. Retrying in ${backoff}ms...`);
                await new Promise((resolve) => setTimeout(resolve, backoff));
                backoff *= 2; // Exponential backoff
            } else {
                return res;
                // throw new Error(`Failed to fetch after ${retries} retries: ${error.message}`);
            }
        }
    }
}

async function put(url: string, body: {}, retries = 5, backoff = 3000) {
    const requestOptions = {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(body),
    };
    for (let attempt = 0; attempt < retries; attempt++) {
        var res;
        try {
            // const response = await fetch(baseUrl + url, requestOptions);
            const response = await fetch(url, requestOptions);
            res = response;
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await handleResponse(response);
        } catch (error) {
            if (attempt < retries - 1) {
                console.log(`Attempt ${attempt + 1} failed. Retrying in ${backoff}ms...`);
                await new Promise((resolve) => setTimeout(resolve, backoff));
                backoff *= 2; // Exponential backoff
            } else {
                return res;
            }
        }
    }
}

async function del(url: string, retries = 5, backoff = 3000) {
    const requestOptions = {
        method: "DELETE",
        headers: await getHeaders(),
    };
    for (let attempt = 0; attempt < retries; attempt++) {
        var res;
        try {
            // const response = await fetch(baseUrl + url, requestOptions);
            const response = await fetch(url, requestOptions);
            res = response;
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await handleResponse(response);
        } catch (error) {
            if (attempt < retries - 1) {
                console.log(`Attempt ${attempt + 1} failed. Retrying in ${backoff}ms...`);
                await new Promise((resolve) => setTimeout(resolve, backoff));
                backoff *= 2; // Exponential backoff
            } else {
                return res;
            }
        }
    }
}

async function getHeaders() {
    const token = await getTokenWorkAround();
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "PostmanRuntime/7.39.0",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    } as any;
    if (token) {
        headers.Authorization = `Bearer ${token.access_token}`;
    }
    return headers;
}

async function handleResponse(response: Response) {
    const text = await response.text();
    // const data = text && JSON.parse(text);
    let data;
    try {
        data = JSON.parse(text);
    } catch (error) {
        data = text;
    }

    if (response.ok) {
        return data || response.statusText;
    } else {
        const error = {
            status: response.status,
            message: typeof data === "string" ? data : response.statusText,
        };
        return { error };
    }
}

export { get, post, put, del };
