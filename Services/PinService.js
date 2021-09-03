import { BACKEND_SERVER } from "../Utils/Resources.js";
import { getUserData } from "../Utils/Memory.js";
import { isPositiveResponse } from "../Models/ResponseData.js";

export function getPinsById(pinId) {
  let url = `${BACKEND_SERVER}/Pins/${pinId}`;
  return getSingle(url);
}

async function getSingle(url) {
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

export function getPinsByType(pinTypeId) {
    let url = `${BACKEND_SERVER}/Pins/type/${pinTypeId}`;
    return getMultiple(url);
}

export function getAllPins() {
    let url = `${BACKEND_SERVER}/Pins`;
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

export async function postNewPin(message) {
  let url = `${BACKEND_SERVER}/Pins/`;

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

export async function putPin(message) {
  let idPin = JSON.parse(message).id;
  let url = `${BACKEND_SERVER}/Pins/${idPin}`;

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

export async function deletePin(id) {
  let url = `${BACKEND_SERVER}/Pins/${id}`;

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
