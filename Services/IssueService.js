import { BACKEND_SERVER } from "../Utils/Resources.js";
import { getUserData } from "../Utils/Memory.js";
import { isPositiveResponse } from "../Models/ResponseData.js";

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
  if (isPositiveResponse(response.status)) {
    return response.json();
  }
  else {
    return response;
  }
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
  if (isPositiveResponse(response.status)) {
    return response.json();
  }
  else {
    return response;
  }
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
  if (isPositiveResponse(response.status)) {
    return response.json();
  }
  else {
    return response;
  }
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
  if (isPositiveResponse(response.status)) {
    return response.json();
  }
  else {
    return response;
  }
}
