import { PinType } from "../Models/PinType.js";
import { BACKEND_SERVER } from "../Utils/Resources.js";

export function getAllPinTypes() {
  let url = `${BACKEND_SERVER}/PinTypes`;
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
