import {
  loadMap,
  initIssueTableFilters,
  setActiveFilterButton,
  setMapButtonStyle,
  getPinOptionsPopup,
  addInputFieldValidations,
  hasInvalidValue,
  loadInputFormOptions,
  setInputElementValue,
  showAllWorks,
  validateAuthorization
} from './map-page-template.js';
import {
  deletePin,
  getAllPins,
  postNewPin,
  putPin
} from "./Services/PinService.js";
import {getAllPinTypes} from "./Services/PinTypeService.js";
import {
  arrayToSeparatedString,
  separatedStringToArray
} from "./Utils/StringOperations.js";
import {getAllDepartments} from "./Services/DepartmentService.js";
import {Pin} from "./Models/Pin.js";
import {Work} from "./Models/Work.js";
import {postNewWork} from "./Services/WorkService.js";
import {getAllStatuses} from "./Services/StatusService.js";
import {getPinViewArray} from "./Models/PinView.js";

var pageMap = L.map('mapid').setView([45.752373, 21.227216], 14);
window.addEventListener('load', init);

function init() {
  validateAuthorization(() => { window.location.href = "index.html"; } );

  loadMap(pageMap);
  loadMapPins();

  pageMap.on('click', onMapClick);
  loadPinTypes();
  initTableSelector();

  initIssueTableFilters();

  getAllStatuses().then(statusList => {
    let issueStatusSelector = document.getElementById("work-status");
    loadInputFormOptions(issueStatusSelector, statusList);
  });

  addCreatePinEvent();
  addUpdatePinEvent();
  addClosePinFormEvent();

  getAllDepartments().then(departmentList => {
    let departmentSelector = document.getElementById("work-department");
    loadInputFormOptions(departmentSelector, departmentList);
  });

  addCloseWorkFormEvent();
  addCreateWorkEvent();

  addInputFieldValidations();
}

//MAP FUNCTIONS
function loadMapPins() {
  getAllPins()
    .then(pinsList => {
      pinsList.forEach(pin => {
        let newMarker = L.marker([pin.gpsCoordX, pin.gpsCoordY]).addTo(pageMap);

        let popup = getPinOptionsPopup(pin.name);
        popup.appendChild(getUpdatePinButton(pin));
        popup.appendChild(getRemovePinButton(pin));
        popup.appendChild(getAddWorkPinButton(pin));

        newMarker.bindPopup(popup);
      })
    })
    .catch(error => console.log('error', error));
}

function getUpdatePinButton(selectedPin) {
  let changeBtn = L.DomUtil.create('a');

  setMapButtonStyle(changeBtn);

  changeBtn.innerHTML = "Modifică marcaj"

  changeBtn.addEventListener('click', () => {
    showPinInputForm(true);
    showClickedPin(selectedPin);
    setUpdatePinBtnVisibility(true);
    setAddPinBtnVisibility(false);
    document.location.href = "#pin-create-form";
  });

  return changeBtn;
}

function getRemovePinButton(pin) {
  let deletePinBtn = L.DomUtil.create('a');

  setMapButtonStyle(deletePinBtn);

  deletePinBtn.innerHTML = "Șterge marcaj"
  deletePinBtn.addEventListener('click', () => {
    removePin(pin.id, pin.name);
  });

  return deletePinBtn;
}

function getAddWorkPinButton(pin) {
  let button = L.DomUtil.create('a');

  setMapButtonStyle(button);

  button.innerHTML = "Adaugă o lucrare"
  button.addEventListener('click', () => {
    showWorkInputForm(true);
    setInputElementValue('work-id', 0);
    setInputElementValue('work-pin-id', pin.id);
    setInputElementValue('work-details', "");
    document.location.href = "#work-create-form";
  });

  return button;
}

function onMapClick(e) {
  let coordinates = e.latlng;

  let optionList = L.DomUtil.create('LI', 'options');
  optionList.style.listStyle = "none";
  optionList.appendChild(getAddPinButton(coordinates));

  L.popup().setLatLng(coordinates).setContent(optionList).openOn(pageMap);
}

function getAddPinButton(coordinates) {
  let addPinBtn = L.DomUtil.create('a');

  setMapButtonStyle(addPinBtn);

  addPinBtn.innerHTML = "Adaugă marcaj nou"

  addPinBtn.addEventListener('click', () => {
    showPinInputForm(true);
    showClickedPin(new Pin({
      id: 0,
      pinTypeId: 1,
      gpsCoordX: coordinates.lat,
      gpsCoordY: coordinates.lng,
      description: '',
      name: '',
      isHeritage: false
    }));
    setAddPinBtnVisibility(true);
    setUpdatePinBtnVisibility(false);
    document.location.href = "#pin-create-form";
  });

  return addPinBtn;
}

function removePin(pinId, pinName) {
  deletePin(pinId)
    .then(_ => {
      alert(`Marcajul cu numele "${pinName}" a fost șters.`);
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert(`Marcajul cu numele "${pinName}" a fost șters. Te rugăm sa încerci din nou.`);
    });
}

//DATA TABLES
function initTableSelector() {
  const selector = document.getElementById("selectedList");
  selector.value = "Selectează un tabel";
  selector.addEventListener('change', showSelectedTable);
}

function showSelectedTable() {
  const selectedOption = document.getElementById("selectedList").value;
  if (selectedOption == 'sesizari') {
    showIssuesTable();
    hidePinsTable();
    hideWorksTable();
  } else if (selectedOption == 'marcaj') {
    hideIssuesTable();
    showPinsTable();
    hideWorksTable();
  } else if (selectedOption == 'lucrari') {
    hideIssuesTable();
    hidePinsTable();
    showWorksTable();
  } else {
    hideIssuesTable();
    hidePinsTable();
    hideWorksTable();
  }
}

function showIssuesTable() {
  const issuesListSelector = document.getElementById('issues-list-selector');
  issuesListSelector.style.display = "inline-block";

  const issuesList = document.getElementById('issuesList');
  issuesList.style.display = "block";

  setActiveFilterButton('toate');
}

function hideIssuesTable() {
  const issuesList = document.getElementById('issuesList');
  issuesList.style.display = "none";
  const issuesListSelector = document.getElementById('issues-list-selector');
  issuesListSelector.style.display = "none";
}

function showPinsTable() {
  const pinsList = document.getElementById('pinsList');
  pinsList.style.display = "block";
  showAllPins();
}

function hidePinsTable() {
  const pinsList = document.getElementById('pinsList');
  pinsList.style.display = "none";
}

function showWorksTable() {
  const worksList = document.getElementById('worksList');
  worksList.style.display = "block";
  showAllWorks();
}

function hideWorksTable() {
  const worksList = document.getElementById('worksList');
  worksList.style.display = "none";
}

async function showAllPins() {
  let values = await Promise.all([getAllPins(), getAllPinTypes()]);
  let pinViewCollection = getPinViewArray(values[0], values[1]);
  showPins(pinViewCollection);
}

function showPins(pinsArray) {
  let output = '';
  let pinsTableBody = document.getElementById('pinsTableBody');
  pinsTableBody.innerHTML = output;
  pinsArray.forEach((pin) => {
    output = `
            <tr>
                <td>${pin.id}</td>
                <td>${pin.pinTypeName}</td>
                <td>${pin.name}</td>
                <td class="btn-group">
                    <button id=${pin.id} type="button" onclick="window.location.href='detalii.html?id=${pin.id}'"
                    class="btn btn-sm btn-round btn-primary table-btn btn-primary-customization">
                        Detalii
                    </button>
<!--                    <button id=${pin.id} type="button" href='detalii.html' class="btn btn-sm btn-round btn-fill btn-default table-btn">Modifică</button>-->
<!--                    <button id=${pin.id} type="button" class="btn btn-sm btn-round btn-fill btn-default table-btn">Șterge</button>-->
                </td>
            <tr>
        `;
    pinsTableBody.innerHTML += output;
  });
}

//PIN EDITOR FORM
function addCreatePinEvent() {
  document.getElementById("create-pin").addEventListener('click',
    () => {
      let message = getPinFormData();
      if (message) {
        createPin(message);
      }
    });
}

function addUpdatePinEvent() {
  document.getElementById("modify-pin").addEventListener('click',
    () => {
      let message = getPinFormData();
      if (message) {
        updatePin(message);
      }
    });
}

function addClosePinFormEvent() {
  document.getElementById('close-pin-form').addEventListener('click',
    () => {
      let formElement = document.getElementById("pin-create-form");
      formElement.style.display = "none";
      location.reload();
    });
}

function loadPinTypes() {
  getAllPinTypes().then( pinTypeList => {
    let selector = document.getElementById("pin-type-input");

    pinTypeList.forEach(pinType => {
      let option = document.createElement("option");
      option.text = arrayToSeparatedString(pinType.id, pinType.name);
      selector.add(option);
    });

  }).catch(error => console.log('error', error));
}

function showPinInputForm(isVisible) {
  let formElement = document.getElementById("pin-create-form");
  if (isVisible) {
    formElement.style.display = "block";
  } else {
    formElement.style.display = "none";
  }
}

function setAddPinBtnVisibility(isVisible) {
  let btn = document.getElementById("create-pin");
  if (isVisible) {
    btn.style.display = "inline";
  } else {
    btn.style.display = "none";
  }
}

function setUpdatePinBtnVisibility(isVisible) {
  let btn = document.getElementById("modify-pin");
  if (isVisible) {
    btn.style.display = "inline";
  } else {
    btn.style.display = "none";
  }
}

function showClickedPin(pin) {
  setInputElementValue('pinCode', pin.id);

  let pinTypeId = document.getElementById('pin-type-input');
  for (let i = 0; i < pinTypeId.options.length; i++) {
    if (pinTypeId[i].text.startsWith(pin.pinTypeId)) {
      pinTypeId.selectedIndex = i;
    }
  }

  setInputElementValue('pin-name', pin.name);
  setInputElementValue('pin-description', pin.description);

  setInputElementValue('latitude', pin.gpsCoordX);
  setInputElementValue('longitude', pin.gpsCoordY);
}

function getPinFormData() {
  let latitudeElement = document.getElementById('latitude');
  if (hasInvalidValue(latitudeElement)) {
    return null;
  }

  let longitudeElement = document.getElementById('longitude');
  if (hasInvalidValue(longitudeElement)) {
    return null;
  }

  let descriptionElement = document.getElementById('pin-description');
  if (hasInvalidValue(descriptionElement)) {
    return null;
  }

  let nameElement = document.getElementById('pin-name');
  if (hasInvalidValue(nameElement)) {
    return null;
  }

  let idElement = document.getElementById('pinCode');
  let pinId = parseInt(idElement.value);
  if (isNaN(pinId)) {
    pinId = 0;
  }

  const isHeritage = document.getElementById('isHeritage').checked;

  let selector = document.getElementById("pin-type-input");
  const selectedOption = selector.value;
  const pinType = parseInt(separatedStringToArray(selectedOption)[0]);

  return JSON.stringify({
    "id": pinId,
    "pinTypeId": pinType,
    "gpsCoordX": latitudeElement.value,
    "gpsCoordY": longitudeElement.value,
    "name": nameElement.value,
    "description": descriptionElement.value,
    "isHeritage": isHeritage
  });
}

function createPin(message) {
  postNewPin(message)
    .then(response => {
      alert(`Marcajul cu numele "${response.data.name}" fost salvat.`);
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm să încerci din nou.');
    });
}

function updatePin(message) {
  putPin(message)
    .then(response => {
      alert(`Marcajul cu numele "${response.data.name}" fost modificat.`);
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
}

//WORK EDIT FORM
function addCreateWorkEvent() {
  document.getElementById("create-work").addEventListener('click',
    () => {
      let message = getWorkFormData();
      if (message) {
        createWork(message);
      }
    });
}

function addCloseWorkFormEvent() {
  document.getElementById('close-work-form').addEventListener('click',
    () => {
      let formElement = document.getElementById("work-create-form");
      formElement.style.display = "none";
      location.reload();
    });
}

function showWorkInputForm(isVisible) {
  let formElement = document.getElementById("work-create-form");
  if (isVisible) {
    formElement.style.display = "block";
  } else {
    formElement.style.display = "none";
  }
}

function getWorkFormData() {
  let detailsElement = document.getElementById('work-details');
  if (hasInvalidValue(detailsElement)) {
    return null;
  }

  let idElement = document.getElementById('work-pin-id');
  let pinId = parseInt(idElement.value);
  if (isNaN(pinId)) {
    return null;
  }

  idElement = document.getElementById('work-id');
  let workId = parseInt(idElement.value);
  if (isNaN(pinId)) {
    workId = 0;
  }

  let selector = document.getElementById("work-department");
  let selectedOption = selector.value;
  const department = parseInt(separatedStringToArray(selectedOption)[0]);

  selector = document.getElementById("work-status");
  selectedOption = selector.value;
  const status = parseInt(separatedStringToArray(selectedOption)[0]);

  return JSON.stringify(new Work({
    "id": workId,
    "details": detailsElement.value,
    "statusId": status,
    "pinId": pinId,
    "departmentId": department
  }));
}

function createWork(message) {
  postNewWork(message)
    .then(response => {
      alert(`Lucararea cu id "${response.data.id}" fost înregistrată.`);
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm să încerci din nou.');
    });
}
