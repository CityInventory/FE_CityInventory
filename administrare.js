import {pagestemplate} from './pages-template.js';
import {showAllPins, showAllWorks} from './filters.js';
import {
  loadMap,
  initIssueTableFilters
} from './MapPageTemplate.js';
import {getAllPins} from "./Services/PinService.js";
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
  // document.getElementById('pinsTableBody').addEventListener('click', removePin);
  loadPinTypes();
  initTableSelector();

  initIssueTableFilters();
}

//MAP FUNCTIONS
function loadMapPins() {
  getAllPins()
    .then(pinsList => {
      pinsList.forEach(pin => {
        var newMarker = L.marker([pin.gpsCoordX, pin.gpsCoordY])
          .addTo(pageMap);

        var popup = L.DomUtil.create('LI', 'options');
        popup.style.listStyle = "none";

        var title = L.DomUtil.create('h5');
        title.innerHTML = pin.name;
        popup.appendChild(title);


        var changeBtn = L.DomUtil.create('a');
        changeBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        changeBtn.innerHTML = "Modifică marcaj"
        changeBtn.style.color = "white";
        changeBtn.style.display = "flex";
        changeBtn.addEventListener('click', () => {
          showInputForm(true);
          showClickedPin(pin);
          setUpdatePinBtnVisibility(true);
          document.location.href = "#pin-create-form";
        });
        popup.appendChild(changeBtn);

        var deletePinBtn = L.DomUtil.create('a');
        deletePinBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn delete");
        deletePinBtn.innerHTML = "Șterge marcaj"
        deletePinBtn.style.color = "white";
        deletePinBtn.style.display = "flex";
        deletePinBtn.style.marginTop = "4px";
        deletePinBtn.addEventListener('click', () => {
          removePin(pin.id);
        });
        popup.appendChild(deletePinBtn);

        newMarker.bindPopup(popup);
      })
    })
    .catch(error => console.log('error', error));
}

function onMapClick(e) {
  let coordinates = e.latlng;

  var addPinBtn = L.DomUtil.create('a');
  addPinBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
  addPinBtn.innerHTML = "Adaugă marcaj nou"
  addPinBtn.style.color = "white";
  addPinBtn.addEventListener('click', () => {
    showInputForm(true);
    setPinIdInputValue(0);
    showClickedCoordonates(coordinates);
    setAddPinBtnVisibility(true);
    document.location.href = "#pin-create-form";
  });

  var optionList = L.DomUtil.create('LI', 'options');
  optionList.style.listStyle = "none";
  optionList.appendChild(addPinBtn);

  L.popup().setLatLng(coordinates)
    .setContent(optionList)
    .openOn(pageMap);
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
function loadPinTypes() {
  getAllPinTypes()
    .then(pinTypeList => {
      var selector = document.getElementById("categoryMaster");
      pinTypeList.forEach(pinType => {
        var option = document.createElement("option");
        option.text = arrayToSeparatedString(pinType.id, pinType.name);
        selector.add(option);
      });
    })
    .catch(error => console.log('error', error));
}

function showInputForm(isVisible) {
  var formElement = document.getElementById("pin-create-form");
  if (isVisible) {
    formElement.style.display = "block";
    document.getElementById('cancelBtn').addEventListener('click', cancelNewPinForm);
  } else {
    formElement.style.display = "none";
  }
}

function setAddPinBtnVisibility(isVisible) {
  var btn = document.getElementById("createPinBtn");
  if (isVisible) {
    btn.style.display = "inline";
    btn.addEventListener('click', addNewPin);
  } else {
    btn.style.display = "none";
  }
}

function setUpdatePinBtnVisibility(isVisible) {
  var btn = document.getElementById("modifyBtn");
  if (isVisible) {
    btn.style.display = "inline";
    btn.addEventListener('click', updatePin);
  } else {
    btn.style.display = "none";
  }
}

function cancelNewPinForm() {
  var formElement = document.getElementById("pin-create-form");
  formElement.style.display = "none";
  location.reload();
}

function showClickedCoordonates(coordinates) {
  var latElement = document.getElementById('latitude');
  latElement.value = coordinates.lat;
  latElement.style.border = '1px solid black';

  var lngElement = document.getElementById('longitude');
  lngElement.value = coordinates.lng;
  lngElement.style.border = '1px solid black';
}

function setPinIdInputValue(id) {
  var idElement = document.getElementById('pinCode');
  idElement.value = id;
}

function showClickedPin(pin) {
  setPinIdInputValue(pin.id);

  var pinTypeId = document.getElementById('categoryMaster');
  for (var i = 0; i < pinTypeId.options.length; i++) {
    if (pinTypeId[i].text.startsWith(pin.pinTypeId)) {
      pinTypeId.selectedIndex = i;
    }
  }

  var titleElement = document.getElementById('nume');
  titleElement.value = pin.name;

  var descriptionElement = document.getElementById('pinDescription');
  descriptionElement.value = pin.description;

  var coordinates = {lat: pin.gpsCoordX, lng: pin.gpsCoordY}
  showClickedCoordonates(coordinates);
}

function addNewPin() {
  var message = getFormData();
  if (message) {
    postPin(message);
  }
}

function getFormData() {
  var idElement = document.getElementById('pinCode');
  var pinId = parseInt(idElement.value);
  if (isNaN(pinId)) {
    pinId = 0;
  }

  const description = document.getElementById('pinDescription').value;
  const name = document.getElementById('nume').value;
  const isHeritage = document.getElementById('isHeritage').checked;

  var selector = document.getElementById("categoryMaster");
  const selectedOption = selector.value;
  const pinType = parseInt(separatedStringToArray(selectedOption)[0]);

  let latitude = document.getElementById('latitude').value;
  let longitude = document.getElementById('longitude').value;

  if (latitude == null || latitude == '' || longitude == null || longitude == '') {
    document.getElementById('latitude').style.border = '2px solid red';
    document.getElementById('longitude').style.border = '2px solid red';
    return null;
  }

  return JSON.stringify({
    "id": pinId,
    "pinTypeId": pinType,
    "gpsCoordX": latitude,
    "gpsCoordY": longitude,
    "name": name,
    "description": description,
    "isHeritage": isHeritage
  });
}

function postPin(message) {
  fetch("https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins", {
    method: 'POST',
    headers: {
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  })
    .then(response => response.text())
    .then(result => {
      alert('Solicitarea a fost înregistrată.');
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
}

function updatePin() {
  var message = getFormData();
  if (message) {
    putPin(message);
  }
}

function putPin(message) {
  var idPin = JSON.parse(message).id;
  fetch(`https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/` + idPin, {
    method: 'PUT',
    headers: {
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  })
    .then(response => response.text())
    .then(result => {
      alert('Solicitarea a fost înregistrată.');
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
}

//PIN ACTIONS
function removePin(pinId) {

  var requestOptions = {
    method: 'DELETE',
    redirect: 'follow',
    mode: 'cors'
  };

  fetch(`https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/${pinId}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      alert('Solicitarea a fost înregistrată.');
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Marcajul nu a fost sters de pe harta. Te rugăm sa încerci din nou.');
    });
}
