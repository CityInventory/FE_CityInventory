import {pagestemplate} from './pages-template.js';
import {
  showAllPins,
  showAllWorks
} from './filters.js';
import {
  loadMap,
  initIssueTableFilters,
  setActiveFilterButton,
  setMapButtonStyle,
  getPinOptionsPopup,
  addInputFieldValidations,
  setValidityStyle,
  hasInvalidValue
} from './MapPageTemplate.js';
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

var pageMap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());

function init() {
  pagestemplate.validateAuthorization();

  loadMap(pageMap);
  loadMapPins();

  pageMap.on('click', onMapClick);
  loadPinTypes();
  initTableSelector();

  initIssueTableFilters();

  addCreatePinEvent();
  addUpdatePinEvent();
  addClosePinFormEvent();

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
    showInputForm(true);
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
    showInputForm(true);
    setPinIdInputValue(0);
    showClickedCoordinates(coordinates);
    setPinNameInputValue('');
    setPinDescriptionInputValue('');
    setAddPinBtnVisibility(true);
    setUpdatePinBtnVisibility(false);
    document.location.href = "#pin-create-form";
  });

  return addPinBtn;
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

//PIN EDITOR FORM
function addCreatePinEvent() {
  document.getElementById("create-pin").addEventListener('click',
    () => {
      let message = getFormData();
      if (message) {
        createPin(message);
      }
    });
}

function addUpdatePinEvent() {
  document.getElementById("modify-pin").addEventListener('click',
    () => {
      let message = getFormData();
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

function showInputForm(isVisible) {
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

function showClickedCoordinates(coordinates) {
  let latElement = document.getElementById('latitude');
  latElement.value = coordinates.lat;
  latElement.style.border = '1px solid black';

  let lngElement = document.getElementById('longitude');
  lngElement.value = coordinates.lng;
  lngElement.style.border = '1px solid black';
}

function setPinIdInputValue(id) {
  let idElement = document.getElementById('pinCode');
  idElement.value = id;
}

function setPinNameInputValue(name) {
  let titleElement = document.getElementById('pin-name');
  titleElement.value = name;
  setValidityStyle(titleElement);
}

function setPinDescriptionInputValue(description) {
  let descriptionElement = document.getElementById('pin-description');
  descriptionElement.value = description;
  setValidityStyle(descriptionElement);
}

function showClickedPin(pin) {
  setPinIdInputValue(pin.id);

  let pinTypeId = document.getElementById('pin-type-input');
  for (let i = 0; i < pinTypeId.options.length; i++) {
    if (pinTypeId[i].text.startsWith(pin.pinTypeId)) {
      pinTypeId.selectedIndex = i;
    }
  }

  setPinNameInputValue(pin.name);
  setPinDescriptionInputValue(pin.description);

  let coordinates = {lat: pin.gpsCoordX, lng: pin.gpsCoordY}
  showClickedCoordinates(coordinates);
}

function getFormData() {
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

//PIN ACTIONS
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
