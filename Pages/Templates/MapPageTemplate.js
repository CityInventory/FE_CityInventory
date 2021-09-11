import {
  getAllIssues,
  getIssuesByPinType,
  deleteIssue,
  putIssue
} from "../../Services/IssueService.js";
import {
  getAllPins,
  getPinsByType
} from "../../Services/PinService.js";
import { getAllStatuses } from "../../Services/StatusService.js";
import { getIssuesViewArray } from "../../Models/IssueView.js";
import { IssueFromIssueView } from "../../Models/Issue.js";
import {
  arrayToSeparatedString,
  separatedStringToArray
} from "../../Utils/StringOperations.js";
import { getAllDepartments } from "../../Services/DepartmentService.js";
import { getWorkViewArray } from "../../Models/WorkView.js";
import {
  deleteWork,
  getAllWorks,
  putWork
} from "../../Services/WorkService.js";
import { WorkFromWorkView } from "../../Models/Work.js";
import { ResponseDataFromFetchReponse } from "../../Models/ResponseData.js"
import { Role } from "../../Models/Roles.js";
import { isAuthorized } from "./PageTemplate.js";

// AUTHORIZATION
export function validateAuthorization(refusalCallback = ()=>{}, requiredRole = Role.Unknown) {
  if (!isAuthorized(requiredRole)) {
    alert("Trebuie să fii administrator pentru a putea accesa acest conținut.");
    refusalCallback();
  }
}

// MAP FUNCTIONS
export function loadMap(mapToLoad) {
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(mapToLoad);
}

export function getPinOptionsPopup(pinName) {
  let popup = L.DomUtil.create('LI', 'options');
  popup.style.listStyle = "none";

  let title = L.DomUtil.create('h5');
  title.innerHTML = pinName;
  popup.appendChild(title);

  return popup;
}

export function setMapButtonStyle(element) {
  element.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
  element.style.color = 'white';
}

// ISSUES TABLE
export function initIssueTableFilters(customStyles = () => {}) {
  getAllIssuesView().then(issueList => showStyledIssues(issueList, customStyles));

  document.getElementById('toate').addEventListener('click', function () {
    getAllIssuesView().then(issueList => showStyledIssues(issueList, customStyles));
    setActiveFilterButton('toate');
  })

  document.getElementById('cladiri').addEventListener('click', function () {
    getIssuesViewByPinType(1).then(issueList => showStyledIssues(issueList, customStyles));
    setActiveFilterButton('cladiri');
  });

  document.getElementById('drumuri').addEventListener('click', function () {
    getIssuesViewByPinType(2).then(issueList => showStyledIssues(issueList, customStyles));
    setActiveFilterButton('drumuri');
  });

  document.getElementById('spatiiDeschise').addEventListener('click', function () {
    getIssuesViewByPinType(3).then(issueList => showStyledIssues(issueList, customStyles));
    setActiveFilterButton('spatiiDeschise');
  });

  document.getElementById('altele').addEventListener('click', function () {
    getIssuesViewByPinType(4).then(issueList => showStyledIssues(issueList, customStyles));
    setActiveFilterButton('altele');
  });
}

export function setActiveFilterButton(elementId) {
  let filterButtons = document.getElementById("issues-list-selector").children;
  for (let button of filterButtons) {
    if (button.id == elementId) {
      button.classList.add('active')
    }
    else  {
      button.classList.remove('active')
    }
  }
}

async function showStyledIssues(issueList, customStyles) {
  await showIssues(issueList);
  customStyles();
}

async function getIssuesViewByPinType(selectedPinType) {
  let values = await Promise.all([getIssuesByPinType(selectedPinType), getPinsByType(selectedPinType), getAllStatuses()]);
  let getIssuesResult = ResponseDataFromFetchReponse(values[0])
  if (getIssuesResult.error) {
    console.log(`Reading issues by pin type failed: ${getIssuesResult.error}`);
    return [];
  }
  let getPinsResult = ResponseDataFromFetchReponse(values[1])
  if (getPinsResult.error) {
    console.log(`Reading issues by pin type failed: ${getPinsResult.error}`);
    return [];
  }
  let getStatusesResult = ResponseDataFromFetchReponse(values[2])
  if (getStatusesResult.error) {
    console.log(`Reading statuses failed: ${getStatusesResult.error}`);
    return [];
  }
  return getIssuesViewArray(getIssuesResult.data, getPinsResult.data, getStatusesResult.data);
}

async function getAllIssuesView() {
  let values = await Promise.all([getAllIssues(), getAllPins(), getAllStatuses()]);
  let getIssuesResult = ResponseDataFromFetchReponse(values[0])
  if (getIssuesResult.error) {
    console.log(`Reading issues failed: ${getIssuesResult.error}`);
    return [];
  }
  let getPinsResult = ResponseDataFromFetchReponse(values[1])
  if (getPinsResult.error) {
    console.log(`Reading pins failed: ${getPinsResult.error}`);
    return [];
  }
  let getStatusesResult = ResponseDataFromFetchReponse(values[2])
  if (getStatusesResult.error) {
    console.log(`Reading statuses failed: ${getStatusesResult.error}`);
    return [];
  }
  return getIssuesViewArray(getIssuesResult.data, getPinsResult.data, getStatusesResult.data);
}

async function showIssues(issuesViewArray) {
  let issuesTableBody = document.getElementById('issuesTableBody');
  issuesTableBody.innerHTML = '';

  let statusList = await getAllStatuses()
      .then(response => ResponseDataFromFetchReponse(response))
      .then(result => {
        if (result.error) {
          console.log(`Reading statuses failed: ${result.error}`);
          return [];
        } else {
          return result.data;
        }
      })
      .catch(error => {
        console.log(error);
        return [];
      });

  issuesViewArray.forEach((issueView) => {
    let row = document.createElement("tr");

    let statusCell = document.createElement("td");
    statusCell.append(getSelectElementInTable(statusList, issueView.statusId, (event) => {
      updateIssueStatus(event.target.value, issueView);
    }));

    let optionsCell = document.createElement("td");
    optionsCell.append(getRemoveButtonInTable(row, () => {
      removeIssue(issueView.issueId, (operationSucceeded) => {
        if (operationSucceeded) {
          row.remove();
        }
      })
    }));

    row.append(getTableCellWithContent(issueView.issueId));
    row.append(getTableCellWithContent(issueView.pinName));
    row.append(getTableCellWithContent(issueView.description));
    row.append(statusCell)
    row.append(getTableCellWithContent(issueView.date.toLocaleDateString()))
    row.append(optionsCell)

    issuesTableBody.append(row);
  });
}

function getTableCellWithContent(content) {
  let newCell = document.createElement("td");
  newCell.innerHTML = content;
  return newCell;
}

function updateIssueStatus(selectValue, issueView) {
  issueView.statusId = separatedStringToArray(selectValue)[0];
  let newIssue = new IssueFromIssueView(issueView);
  updateIssue(JSON.stringify(newIssue));
}

function removeIssue(issueId, callback) {
  deleteIssue(issueId)
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        alert(`Sesizarea cu numărul "${issueId}" nu a fost ștearsă. Eroare ${result.error}.`);
        callback(false);
      } else {
        alert(`Sesizarea cu numărul "${issueId}" a fost ștearsă.`);
        callback(true);
      }
    })
    .catch(error => {
      console.log('error', error)
      alert(`Sesizarea cu numărul "${issueId}" nu a fost ștearsă. Te rugăm să încerci din nou.`);
      callback(false);
    });
}

function updateIssue(message) {
  putIssue(message)
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        alert(`Sesizarea nu a fost modificată. Eroare ${result.error}`);
      } else {
        alert(`Sesizarea cu numărul "${result.data.id}" a fost modificată.`);
      }
    })
    .catch(error => {
      console.log('error', error)
      alert(`Sesizarea nu a fost modificată. Te rugăm sa încerci din nou.`);
    });
}

// WORKS TABLE
export function showAllWorks(customStyles = () => {}) {
  getAllWorksView().then(worksList => showStyledWorks(worksList, customStyles));
}

async function getAllWorksView() {
  let values = await Promise.all([getAllWorks(), getAllPins(), getAllStatuses(), getAllDepartments()]);
  let getWorksResult = ResponseDataFromFetchReponse(values[0])
  if (getWorksResult.error) {
    console.log(`Reading works failed: ${getWorksResult.error}`);
    return [];
  }
  let getPinsResult = ResponseDataFromFetchReponse(values[1])
  if (getPinsResult.error) {
    console.log(`Reading pins failed: ${getPinsResult.error}`);
    return [];
  }
  let getStatusesResult = ResponseDataFromFetchReponse(values[2])
  if (getStatusesResult.error) {
    console.log(`Reading statuses failed: ${getStatusesResult.error}`);
    return [];
  }
  let getDepartmentsResult = ResponseDataFromFetchReponse(values[3])
  if (getDepartmentsResult.error) {
    console.log(`Reading departments failed: ${getDepartmentsResult.error}`);
    return [];
  }
  return getWorkViewArray(getWorksResult.data, getPinsResult.data, getStatusesResult.data, getDepartmentsResult.data);
}

async function showStyledWorks(workList, customStyles) {
  await showWorks(workList);
  customStyles();
}

async function showWorks(workViewArray) {
  let tableBody = document.getElementById('works-table-body');
  tableBody.innerHTML = '';

  let statusList = await getAllStatuses()
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        console.log(`Reading statuses failed: ${result.error}`);
        return [];
      } else {
        return result.data;
      }
    })
    .catch(error => {
      console.log(error);
      return [];
    });

  let departmentList = await getAllDepartments()
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        console.log(`Reading departments failed: ${result.error}`);
        return [];
      } else {
        return result.data;
      }
    }).catch(error => {
      console.log(error);
      return [];
    })

  workViewArray.forEach((workView) => {
    let row = document.createElement("tr");

    let statusCell = document.createElement("td");
    statusCell.append(getSelectElementInTable(statusList, workView.statusId, (event) => {
      updateWorkStatus(event.target.value, workView);
    }));

    let departmentCell = document.createElement("td");
    departmentCell.append(getSelectElementInTable(departmentList, workView.departmentId, (event) => {
      updateWorkDepartment(event.target.value, workView);
    }));

    let optionsCell = document.createElement("td");
    optionsCell.append(getRemoveButtonInTable(row, () => {
      removeWork(workView.id, (operationSucceeded) => {
        if (operationSucceeded) {
          row.remove();
        }
      })
    }));

    row.append(getTableCellWithContent(workView.id));
    row.append(getTableCellWithContent(workView.pinName));
    row.append(getTableCellWithContent(workView.details));
    row.append(statusCell)
    row.append(departmentCell)
    row.append(optionsCell)

    tableBody.append(row);
  });
}

function removeWork(workId, callback) {
  deleteWork(workId)
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        alert(`Lucrarea cu numărul "${workId}" nu a fost ștearsă. Eroare: ${result.error}`);
        callback(false);
      } else {
        alert(`Lucrarea cu numărul "${workId}" a fost ștearsă.`);
        callback(true);
      }
    })
    .catch(error => {
      console.log('error', error)
      alert(`Lucrarea cu numărul "${workId}" nu a fost ștearsă. Te rugăm să încerci din nou.`);
      callback(false);
    });
}

function updateWorkStatus(selectValue, workView) {
  workView.statusId = separatedStringToArray(selectValue)[0];
  let newWork = new WorkFromWorkView(workView);
  updateWork(JSON.stringify(newWork));
}

function updateWorkDepartment(selectValue, workView) {
  workView.departmentId = separatedStringToArray(selectValue)[0];
  let newWork = new WorkFromWorkView(workView);
  updateWork(JSON.stringify(newWork));
}

function updateWork(message) {
  putWork(message)
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        alert(`Lucrarea nu a fost modificată. Eroare: ${result.error}`);
      } else {
        alert(`Lucrarea cu numărul "${result.data.id}" a fost modificată.`);
      }
    })
    .catch(error => {
      console.log('error', error)
      alert('Lucrarea nu a fost modificată. Te rugăm sa încerci din nou.');
    });
}

//GENERIC TABLE
function getSelectElementInTable(optionsList, selectedOptionId, selectCallback) {
  let selector = document.createElement("select")

  selector.setAttribute("class","selector-in-table btn btn-primary btn-default btn-primary-customization");

  loadInputFormOptions(selector, optionsList, selectedOptionId);

  selector.addEventListener('change', selectCallback);

  return selector;
}

function getRemoveButtonInTable(tableRow, clickCallback) {
  let removeButton = document.createElement("button");

  removeButton.setAttribute("class", "btn btn-sm btn-round btn-primary table-btn btn-primary-customization");
  removeButton.innerHTML = "Șterge";

  removeButton.addEventListener('click', clickCallback);

  return removeButton;
}

//GENERIC FORM
export function loadInputFormOptions(parentSelectElement, optionCollection, selectedId = 1) {
  optionCollection.forEach(option => {
    let optionElement = document.createElement("option");
    optionElement.text = arrayToSeparatedString(option.id, option.name);
    if (selectedId == option.id)
      optionElement.selected = true;
    parentSelectElement.add(optionElement);
  });
}

export function addInputFieldValidations() {
  let targetedElements = document.getElementsByClassName("requires-validation");
  for (let element of targetedElements) {
    element.addEventListener('change', (ev) => setValidityStyle(ev.target));
  }
}

export function hasInvalidValue(element) {
  return element.value.trim() === '';
}

export function setValidityStyle(element) {
  if (hasInvalidValue(element)) {
    element.style.border = '2px solid red';
  }
  else {
    element.style.border = '1px solid black';
  }
}

export function setInputElementValue(elementId, value) {
  let element = document.getElementById(elementId);
  element.value = value;
  setValidityStyle(element);
}
