import { BACKEND_SERVER } from "../Utils/Resources.js";
import { isPositiveResponse } from "../Models/ResponseData.js";

export async function postNewToken(message) {
  let url = `${BACKEND_SERVER}/User/authenticate`;

  let requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
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