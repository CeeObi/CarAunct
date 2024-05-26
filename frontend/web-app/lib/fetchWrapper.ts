import { getTokenWorkAround } from "@/app/actions/authActions"

const baseUrl = process.env.API_URL

async function get(url:string) {
    const requestOptions ={
        method: "GET",
        headers: await getHeaders(),
    }
    const response = await fetchWithRetries(baseUrl + url, requestOptions)
    return await handleResponse(response)    
}

async function post(url:string, body:{}) {
    const requestOptions ={
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }
    const response = await fetchWithRetries(baseUrl + url, requestOptions)
    return await handleResponse(response)    
}

async function put(url:string, body:{}) {
    const requestOptions ={
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }
    const response = await fetchWithRetries(baseUrl + url, requestOptions)
    return await handleResponse(response)    
}

async function del(url:string) {
    const requestOptions ={
        method: "DELETE",
        headers: await getHeaders()
    }
    const response = await fetchWithRetries(baseUrl + url, requestOptions)
    return await handleResponse(response)    
}

let global_response:any ;
// /////////////////////////////////
async function fetchWithRetries(url:any, options:any, retries = 4, backoff = 1000) {
    try {
        // Try to fetch the data
        const response = await fetch(url, options);

        // Check if the response is okay (status code 2xx)
        if (response.ok) {
            return response; // Parse and return the JSON data
        } else {
            global_response = response
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        // If the number of retries has not been exhausted, retry
        if (retries > 0) {
            console.warn(`Retrying fetch... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, backoff)); // Wait for the backoff duration
            return fetchWithRetries(url, options, retries - 1, backoff * 3); // Increase the backoff time
        } else {
            // throw new Error(`Failed to fetch data after ${retries} retries: ${error.message}`);
            return global_response
        }
    }
}
// //////////////////////////


async function getHeaders() {
    const token = await getTokenWorkAround();
    const headers = { "Content-Type":"application/json" } as any
    if (token){
        headers.Authorization = `Bearer ${token.access_token}`
    }
    return headers    
}


async function handleResponse(response: Response) {  
    const text = await response.text();
    // const data = text && JSON.parse(text);
    let data;
    try {
        data = await JSON.parse(text);
    } catch (error) {
        data = text; 
    }

    if (response.ok){
        return await data || response.statusText
    }else{
        const error = {
            status: response.status,
            message: typeof data === 'string' ? data : response.statusText
        }
        return {error}
    }
}


export {get,post,put,del}
