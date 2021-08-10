import {
  loadMap,
  loadIssueStatusOptions,
  initIssueTableFilters,
  getIssueStatusValues
} from './MapPageTemplate.js';
import {getAllPins} from "./Services/PinService.js";
import {postNewIssue} from "./Services/IssueService.js";
import {separatedStringToArray} from "./Utils/StringOperations.js";
import {Issue} from "./Models/Issue.js";

var pageMap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());

function init() {
  loadMap(pageMap);
  loadMapPins();

  initIssueTableFilters(disableIssueStatusSelectors);

  getIssueStatusValues().then(statusList => {
    let issueStatusSelector = document.getElementById("issue-status-selector");
    loadIssueStatusOptions(issueStatusSelector, statusList);
  });

  addIssueFormCreateEvent();
  addIssueFormCancelEvent();
}

//MAP FUNCTIONS
function loadMapPins() {
  getAllPins()
    .then(pinsList => {
      pinsList.forEach(pin => {
        var newMarker = L.marker([pin.gpsCoordX, pin.gpsCoordY]).addTo(pageMap);

        var popup = L.DomUtil.create('LI', 'options');
        popup.style.listStyle = "none";

        var title = L.DomUtil.create('h5');
        title.innerHTML = pin.name;
        popup.appendChild(title);

        var details = L.DomUtil.create('a');
        details.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        details.setAttribute("href", "detalii.html?id=" + pin.id);
        details.innerHTML = "Detalii"
        popup.appendChild(details);

        var addIssueBtn = L.DomUtil.create('a');
        addIssueBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        addIssueBtn.innerHTML = "Adaugă sesizare"
        addIssueBtn.style.color = "white";
        addIssueBtn.addEventListener('click', () => {
          document.getElementById('issue-form-pin-id').value = pin.id;
          showIssueInputForm();
        });
        popup.appendChild(addIssueBtn);

        // var issues = L.DomUtil.create('a');
        // issues.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        // issues.setAttribute("href", "#filter-select-buttons");
        // issues.innerHTML = "Listă sesizări"
        // popup.appendChild(issues);

        newMarker.bindPopup(popup);
      })
    })
    .catch(error => console.log('error', error));
}

// ISSUES TABLE
function disableIssueStatusSelectors() {
  let selectors = document.getElementsByClassName('issue-status-form-selector');
  for (let element of selectors) {
    element.disabled = true;
  }
}

// ISSUES INPUT FORM
function addIssueFormCancelEvent() {
  document.getElementById('cancel-issue-btn')
    .addEventListener('click', () => {
      hideIssueInputForm();
      postCancelAction();
    });
}

function addIssueFormCreateEvent() {
  document.getElementById('save-issue-btn')
    .addEventListener('click', () => {
      addNewIssue();
    });
}

function showIssueInputForm() {
  let formElement = document.getElementById("issue-create-form");
  formElement.style.display = "block";
  document.location.href = "#issue-create-form";
}

function hideIssueInputForm() {
  let formElement = document.getElementById("issue-create-form");
  formElement.style.display = "none";
  window.location = window.location.origin + window.location.pathname;
}

function addNewIssue() {
  var message = getIssueFormData();
  if (!message) {
    return;
  }

  postNewIssue(message)
    .then(result => {
      alert(`Sesizarea cu numărul ${result.data.id} a fost înregistrată.`);
      hideIssueInputForm();
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
}

function getIssueFormData() {
  let issueIdElement = document.getElementById('issue-form-issue-id');
  let issueId = parseInt(issueIdElement.value);
  if (isNaN(issueId)) {
    issueIdElement.style.border = '2px solid red';
    return;
  }

  let pinIdElement = document.getElementById('issue-form-pin-id');
  let pinId = parseInt(pinIdElement.value);
  if (isNaN(pinId)) {
    pinIdElement.style.border = '2px solid red';
    return;
  }

  let selector = document.getElementById("issue-status-selector");
  const selectedOption = selector.value;
  const statusId = parseInt(separatedStringToArray(selectedOption)[0]);

  const description = document.getElementById('issue-description').value;

  return JSON.stringify(
    new Issue({
      "id": issueId,
      "pinId": pinId,
      "statusId": statusId,
      "details": description
    })
  );
}
