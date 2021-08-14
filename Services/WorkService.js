import {Work} from "../Models/Work.js";

export async function postNewWork(message) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Works";

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
