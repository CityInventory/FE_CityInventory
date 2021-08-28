import { Pin } from "../Models/Pin.js";
import { BACKEND_SERVER } from "../Utils/Resources.js";
import { getUserData } from "../Utils/Memory.js";

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

  return await response.json();
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

    const result = await response.json();
    return result.data.map(raw => new Pin(raw));
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
  return response.json();
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
  return response.json();
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

  return response.json();
}
