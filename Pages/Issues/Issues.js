import {
  loadMap,
  loadInputFormOptions,
  initIssueTableFilters,
  setActiveFilterButton,
  setMapButtonStyle,
  getPinOptionsPopup,
  addInputFieldValidations,
  setValidityStyle,
  hasInvalidValue,
  setInputElementValue
} from '../Templates/MapPageTemplate.js';
import { getAllPins } from "../../Services/PinService.js";
import { postNewIssue } from "../../Services/IssueService.js";
import { separatedStringToArray } from "../../Utils/StringOperations.js";
import { Issue } from "../../Models/Issue.js";
import { getAllStatuses } from "../../Services/StatusService.js";
import { ResponseDataFromFetchReponse } from "../../Models/ResponseData.js"
import {
  loadNavbar,
  loadSidebar,
  loadFooter,
  isAuthorized
} from "../Templates/PageTemplate.js";
import { SidebarItemId } from "../Templates/SideBar.js";

var pageMap = L.map('mapid').setView([45.752373, 21.227216], 14);
window.addEventListener('load', init);

function init() {
  loadSidebar(SidebarItemId.Issues);
  loadNavbar();
  loadMap(pageMap);
  loadMapPins();

  initIssueTableFilters(disableIssueStatusSelectors);

  getAllStatuses()
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        console.log(`Reading statuses failed: ${result.error}`);
      } else {
        let issueStatusSelector = document.getElementById("issue-status-selector");
        loadInputFormOptions(issueStatusSelector, result.data);
      }
    })
    .catch(error => { console.log(error); });

  addIssueFormCreateEvent();
  addIssueFormCancelEvent();

  setActiveFilterButton('toate');

  addInputFieldValidations();
  loadFooter();
}

//MAP FUNCTIONS
function loadMapPins() {
  getAllPins()
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        console.log(`Reading pins failed: ${result.error}`);
      } else {
        result.data.forEach(pin => {
          let newMarker = L.marker([pin.gpsCoordX, pin.gpsCoordY]).addTo(pageMap);

          let popup = getPinOptionsPopup(pin.name);
          popup.appendChild(getPinDetailsButton(pin.id));
          popup.appendChild(getIssueCreateButton(pin.id));

          // let issues = L.DomUtil.create('a');
          // issues.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
          // issues.setAttribute("href", "#filter-select-buttons");
          // issues.innerHTML = "Listă sesizări"
          // popup.appendChild(issues);

          newMarker.bindPopup(popup);
        })
      }
    })
    .catch(error => console.log('error', error));
}

function getPinDetailsButton(pinId) {
  let details = L.DomUtil.create('a');
  details.setAttribute("href", "../Details/Details.html?id=" + pinId);
  setMapButtonStyle(details);
  details.innerHTML = "Detalii"
  return details;
}

function getIssueCreateButton(pinId) {
  let addIssueBtn = L.DomUtil.create('a');

  setMapButtonStyle(addIssueBtn);
  addIssueBtn.innerHTML = "Adaugă sesizare"

  addIssueBtn.addEventListener('click', () => {
    if(isAuthorized()) {
      setInputElementValue("issue-form-pin-id", pinId);
      showIssueInputForm();
    } else {
      alert("Doar utilizatorii autentificați pot adăuga sesizări.")
    }
  });

  return addIssueBtn;
}

// ISSUES TABLE
function disableIssueStatusSelectors() {
  let selectors = document.getElementsByClassName('selector-in-table');
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
  setValidityStyle(document.getElementById('issue-description'));
}

function hideIssueInputForm() {
  let formElement = document.getElementById("issue-create-form");
  formElement.style.display = "none";
  window.location = window.location.origin + window.location.pathname;
}

function addNewIssue() {
  let message = getIssueFormData();
  if (!message) {
    return;
  }

  postNewIssue(message)
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        alert(`Sesizarea nu a putut fi înregistrată. Eroare: ${result.error}`);
      } else {
        alert(`Sesizarea cu numărul "${result.data.id}" a fost înregistrată.`);
        hideIssueInputForm();
      }
    })
    .catch(error => {
      console.log('error', error)
      alert('Sesizarea nu a putut fi înregistrată. Te rugăm sa încerci din nou.');
    });
}

function getIssueFormData() {
  const descriptionElement = document.getElementById('issue-description');
  if(hasInvalidValue(descriptionElement)) {
    return null;
  }
  const description = descriptionElement.value;

  let issueIdElement = document.getElementById('issue-form-issue-id');
  let issueId = parseInt(issueIdElement.value);
  if (isNaN(issueId)) {
    return null;
  }

  let pinIdElement = document.getElementById('issue-form-pin-id');
  let pinId = parseInt(pinIdElement.value);
  if (isNaN(pinId)) {
    return null;
  }

  let selector = document.getElementById("issue-status-selector");
  const selectedOption = selector.value;
  const statusId = parseInt(separatedStringToArray(selectedOption)[0]);

  return JSON.stringify(
    new Issue({
      "id": issueId,
      "pinId": pinId,
      "statusId": statusId,
      "details": description
    })
  );
}
