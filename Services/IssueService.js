import {Issue} from "../Models/Issue.js";

export function getIssuesByPinType(pinTypeId) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues/pinType/" + pinTypeId;
  return getMultiple(url);
}

export function getAllIssues() {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues";
  return getMultiple(url);
}

async function getMultiple(url) {
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  const response = await fetch(url, requestOptions);

  const result = await response.json();
  return result.data.map(raw => new Issue(raw));
}


export async function postNewIssue(message) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues";

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

export async function deleteIssue(id) {
  let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues/" + id;

  let requestOptions = {
    method: 'DELETE',
    redirect: 'follow',
    mode: 'cors'
  };
  const response = await fetch(url, requestOptions);

  return response.json();
}
