import { Issue } from "../Models/Issue.js";
import { BACKEND_SERVER } from "../Utils/Resources.js";
import { getUserData } from "../Utils/Memory.js";

export function getIssuesByPinType(pinTypeId) {
  let url = `${BACKEND_SERVER}/Issues/pinType/${pinTypeId}`;
  return getMultiple(url);
}

export function getAllIssues() {
  let url = `${BACKEND_SERVER}/Issues`;
  return getMultiple(url);
}

async function getMultiple(url) {
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const response = await fetch(url, requestOptions);

  const result = await response.json();
  return result.data.map(raw => new Issue(raw));
}


export async function postNewIssue(message) {
  let url = `${BACKEND_SERVER}/Issues`;

  let requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getUserData().key}`,      
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  };

  const response = await fetch(url, requestOptions);
  return response.json();
}

export async function deleteIssue(id) {
  let url = `${BACKEND_SERVER}/Issues/${id}`;

  let requestOptions = {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getUserData().key}`,
    },    
    redirect: 'follow',
    mode: 'cors'
  };
  const response = await fetch(url, requestOptions);

  return response.json();
}

export async function putIssue(message) {
  let issueId = JSON.parse(message).id;
  let url = `${BACKEND_SERVER}/Issues/${issueId}`;

  let requestOptions = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getUserData().key}`,
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  };

  const response = await fetch(url, requestOptions);
  return response.json();
}
