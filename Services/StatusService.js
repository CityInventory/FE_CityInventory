import { BACKEND_SERVER } from "../Utils/Resources.js";
import { isPositiveResponse } from "../Models/ResponseData.js";

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

    if (isPositiveResponse(response.status)) {
        return response.json();
    }
    else {
        return response;
    }
}