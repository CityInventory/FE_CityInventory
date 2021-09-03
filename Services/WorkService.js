import { BACKEND_SERVER } from "../Utils/Resources.js";
import { getUserData } from "../Utils/Memory.js";
import { isPositiveResponse } from "../Models/ResponseData.js";

export function getAllWorks() {
  let url = `${BACKEND_SERVER}/Works`;
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


export async function postNewWork(message) {
  let url = `${BACKEND_SERVER}/Works/`;

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

export async function deleteWork(id) {
  let url = `${BACKEND_SERVER}/Works/${id}`;

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

export async function putWork(message) {
  let workId = JSON.parse(message).id;
  let url = `${BACKEND_SERVER}/Works/${workId}`;

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
