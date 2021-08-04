import { Pin } from "../Models/Pin.js";

export function getPinsByType(pinTypeId) {
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/type/" + pinTypeId;
    return getMultiple(url);
}

export function getAllPins() {
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins";
    return getMultiple(url);
}

async function getMultiple(url) {
    const response = await fetch(url,
        {
            method: 'GET',
            redirect: 'follow'
        });
    
    const result = await response.json();
    return result.data.map(raw => new Pin(raw));
}