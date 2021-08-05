import {
  getAllIssues,
  getIssuesByPinType,
  postNewIssue,
  deleteIssue
} from "./Services/IssueService.js";
import {getAllPins, getPinsByType} from "./Services/PinService.js";
import {getAllStatuses} from "./Services/StatusService.js";
import {getIssuesViewArray} from "./Models/IssueView.js";
import {Issue} from "./Models/Issue.js";

// ISSUES TABLE
export function showIssuesByPinType(selectedPinType) {
  Promise.all([getIssuesByPinType(selectedPinType), getPinsByType(selectedPinType), getAllStatuses()])
    .then((values) => {
      let issueViewArray = getIssuesViewArray(values[0], values[1], values[2]);
      showIssues(issueViewArray);
    });
}

export function showAllIssues() {
  Promise.all([getAllIssues(), getAllPins(), getAllStatuses()])
    .then((values) => {
      let issueViewArray = getIssuesViewArray(values[0], values[1], values[2]);
      showIssues(issueViewArray);
    });
}

function showIssues(issuesViewArray) {
  let issuesTableBody = document.getElementById('issuesTableBody');
  issuesTableBody.innerHTML = '';

  issuesViewArray.forEach((issueView) => {
    let row = document.createElement("tr");

    let pinNameCell = document.createElement("td");
    pinNameCell.innerHTML = issueView.pinName;
    row.append(pinNameCell)

    let descriptionCell = document.createElement("td");
    descriptionCell.innerHTML = issueView.description;
    row.append(descriptionCell)

    let statusCell = document.createElement("td");
    statusCell.innerHTML = issueView.status;
    row.append(statusCell)

    let dateCell = document.createElement("td");
    dateCell.innerHTML = issueView.date.toDateString();
    row.append(dateCell)

    let optionsCell = document.createElement("td");
    optionsCell.classList.add("btn-group");
    optionsCell.classList.add("table-options");

    let buttonClasses = "btn btn-sm btn-round btn-fill btn-default table-btn".split(" ");
    let updateButton = document.createElement("button");
    buttonClasses.forEach( cssClass => updateButton.classList.add(cssClass) );
    updateButton.innerHTML = "Modifică";
    optionsCell.append(updateButton);

    let removeButton = document.createElement("button");
    buttonClasses.forEach( cssClass => removeButton.classList.add(cssClass) );
    removeButton.innerHTML = "Șterge";
    removeButton.addEventListener('click', () => {
      removeIssue(issueView.issueId, (operationSucceeded) => {
        if(operationSucceeded) {
          row.remove();
        }
      } )
    });
    optionsCell.append(removeButton);

    row.append(optionsCell)

    issuesTableBody.append(row);
  });
}

// ISSUES INPUT FORM
export function createEventsForIssueFormButtons() {
  document.getElementById('create-issue-btn')
    .addEventListener('click', () => {
      addNewIssue();
    });

  document.getElementById('cancel-issue-btn')
    .addEventListener('click', () => {
      showIssueInputForm(false);
    });
}

export function showIssueInputForm(isVisible) {
  let formElement = document.getElementById("issue-create-form");
  if (isVisible) {
    formElement.style.display = "block";
    document.location.href = "#issue-create-form";
  } else {
    formElement.style.display = "none";
    window.location = window.location.origin + window.location.pathname;
  }
}

export function addNewIssue() {
  var message = getIssueFormData();
  if (message) {
    createIssue(message);
  }
}

function getIssueFormData() {
  var idElement = document.getElementById('issue-form-pin-id');
  var pinId = parseInt(idElement.value);
  if (isNaN(pinId)) {
    idElement.style.border = '2px solid red';
    return null;
  }

  const description = document.getElementById('issue-description').value;

  return JSON.stringify(
    new Issue({"pinId": pinId, "details": description})
  );
}

function createIssue(message) {
  postNewIssue(message)
    .then(result => {
      alert('Solicitatea a fost înregistrată.');
      showIssueInputForm(false);
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
}

function removeIssue(issueId, callback) {
  deleteIssue(issueId)
    .then(result => {
      alert('Solicitatea a fost inregistrata.');
      callback(true);
    })
    .catch(error => {
      console.log('error', error)
      alert('Sesizarea nu a fost stearsa. Te rugăm sa încerci din nou.');
      callback(false);
    });
}
