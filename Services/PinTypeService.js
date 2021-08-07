import {PinType} from "../Models/PinType.js";

export function getAllPinTypes() {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/PinTypes";
  return getMultiple(url);
}

async function getMultiple(url) {
  const response = await fetch(url,
    {
      method: 'GET',
      redirect: 'follow'
    });

  const result = await response.json();
  return result.data.map(raw => new PinType(raw));
}
