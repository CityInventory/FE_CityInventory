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

export async function postNewPin(message) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/";

  let requestOptions = {
    method: 'POST',
    headers: {
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
  let url = `https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/${idPin}`;

  let requestOptions = {
    method: 'PUT',
    headers: {
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  };

  const response = await fetch(url, requestOptions);
  return response.json();
}

export async function deletePin(id) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/" + id;

  let requestOptions = {
    method: 'DELETE',
    redirect: 'follow',
    mode: 'cors'
  };
  const response = await fetch(url, requestOptions);

  return response.json();
}
