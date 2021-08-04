import { Issue } from "../Models/Issue.js";

export function getIssuesByPinType(pinTypeId) {
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues/pinType/" + pinTypeId;
    return getMultiple(url);
}

export function getAllIssues() {
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues";
    return getMultiple(url);
}

async function getMultiple(url) {
    const response = await fetch(url,
        {
            method: 'GET',
            redirect: 'follow'
        });
    
    const result = await response.json();
    return result.data.map(raw => new Issue(raw));
}
