import { Status } from "../Models/Status.js";
import { BACKEND_SERVER } from "../Utils/Resources.js";

export function getAllStatuses() {
    let url = `${BACKEND_SERVER}/Status`;
    return getMultiple(url);
}

async function getMultiple(url) {
    const response = await fetch(url,
        {
            method: 'GET',
            redirect: 'follow'
        });
    
    const result = await response.json();
    return result.data.map(raw => new Status(raw));
}