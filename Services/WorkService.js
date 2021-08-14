import {Work} from "../Models/Work.js";

export function getAllWorks() {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Works";
  return getMultiple(url);
}

async function getMultiple(url) {
  const response = await fetch(url,
    {
      method: 'GET',
      redirect: 'follow'
    });

  const result = await response.json();
  return result.data.map(raw => new Work(raw));
}


export async function postNewWork(message) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Works/";

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

export async function deleteWork(id) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Works/" + id;

  let requestOptions = {
    method: 'DELETE',
    redirect: 'follow',
    mode: 'cors'
  };
  const response = await fetch(url, requestOptions);

  return response.json();
}

export async function putWork(message) {
  let workId = JSON.parse(message).id;
  let url = `https://92xjz4ismg.eu-west-1.awsapprunner.com/Works/${workId}`;

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
