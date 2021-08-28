import { Department } from "../Models/Department.js";
import { BACKEND_SERVER } from "../Utils/Resources.js";

export function getAllDepartments() {
  let url = `${BACKEND_SERVER}/Departments`;
  return getMultiple(url);
}

async function getMultiple(url) {
  const response = await fetch(url,
    {
      method: 'GET',
      redirect: 'follow'
    });

  const result = await response.json();
  return result.data.map(raw => new Department(raw));
}
