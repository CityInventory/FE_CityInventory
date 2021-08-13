import {
  getAllIssues,
  getIssuesByPinType,
  deleteIssue,
  putIssue
} from "./Services/IssueService.js";
import {
  getAllPins,
  getPinsByType
} from "./Services/PinService.js";
import {getAllStatuses} from "./Services/StatusService.js";
import {getIssuesViewArray} from "./Models/IssueView.js";
import {IssueFromIssueView} from "./Models/Issue.js";
import {
  arrayToSeparatedString,
  separatedStringToArray
} from "./Utils/StringOperations.js";

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

// ISSUES TABLE
export function initIssueTableFilters(customStyles = () => {
}) {
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
  return getIssuesViewArray(values[0], values[1], values[2]);
}

async function getAllIssuesView() {
  let values = await Promise.all([getAllIssues(), getAllPins(), getAllStatuses()]);
  return getIssuesViewArray(values[0], values[1], values[2]);
}

async function showIssues(issuesViewArray) {
  let issuesTableBody = document.getElementById('issuesTableBody');
  issuesTableBody.innerHTML = '';

  let statusList = await getIssueStatusValues();
  issuesViewArray.forEach((issueView) => {
    let row = document.createElement("tr");

    let issueIdCell = document.createElement("td");
    issueIdCell.innerHTML = issueView.issueId;
    row.append(issueIdCell)

    let pinNameCell = document.createElement("td");
    pinNameCell.innerHTML = issueView.pinName;
    row.append(pinNameCell)

    let descriptionCell = document.createElement("td");
    descriptionCell.innerHTML = issueView.description;
    row.append(descriptionCell)

    let statusCell = document.createElement("td");
    let statusSelector = document.createElement("select")
    statusSelector.classList.add("issue-status-form-selector");
    statusSelector.classList.add("btn");
    statusSelector.classList.add("btn-primary");
    statusSelector.classList.add("btn-default");
    statusSelector.classList.add("btn-primary-customization");
    loadIssueStatusOptions(statusSelector, statusList, issueView.statusId);
    statusSelector.addEventListener('change', (event) => {
      updateIssueStatus(event.target.value, issueView);
    });
    statusCell.append(statusSelector);
    row.append(statusCell)

    let dateCell = document.createElement("td");
    dateCell.innerHTML = issueView.date.toDateString();
    row.append(dateCell)

    let optionsCell = document.createElement("td");
    optionsCell.classList.add("btn-group");
    optionsCell.classList.add("table-options");

    let buttonClasses = "btn btn-sm btn-round btn-primary table-btn btn-primary-customization".split(" ");
    let removeButton = document.createElement("button");
    buttonClasses.forEach(cssClass => removeButton.classList.add(cssClass));
    removeButton.innerHTML = "Șterge";
    removeButton.addEventListener('click', () => {
      removeIssue(issueView.issueId, (operationSucceeded) => {
        if (operationSucceeded) {
          row.remove();
        }
      })
    });
    optionsCell.append(removeButton);

    row.append(optionsCell)

    issuesTableBody.append(row);
  });
}

function updateIssueStatus(selectValue, issueView) {
  issueView.statusId = separatedStringToArray(selectValue)[0];
  let newIssue = new IssueFromIssueView(issueView);
  updateIssue(JSON.stringify(newIssue));
}

function removeIssue(issueId, callback) {
  deleteIssue(issueId)
    .then(_ => {
      alert(`Sesizarea cu numărul ${issueId} a fost ștearsă.`);
      callback(true);
    })
    .catch(error => {
      console.log('error', error)
      alert(`Sesizarea cu numărul ${issueId} nu a fost ștearsă. Te rugăm să încerci din nou.`);
      callback(false);
    });
}

function updateIssue(message) {
  putIssue(message)
    .then(result => {
      alert(`Sesizarea cu numărul ${result.data.id} a fost modificată.`);
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
}

// ISSUES TABLE + ISSUES INPUT FORM
export async function getIssueStatusValues() {
  return await getAllStatuses();
}

export function loadIssueStatusOptions(parentSelectElement, statusList, selectedStatusId = 1) {
  statusList.forEach(status => {
    var option = document.createElement("option");
    option.text = arrayToSeparatedString(status.id, status.name);
    if (selectedStatusId == status.id)
      option.selected = true;
    parentSelectElement.add(option);
  });
}
