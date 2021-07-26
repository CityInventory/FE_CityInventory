import { pagestemplate } from './pages-template.js';
import { showIssuesByPinType, showAllIssues} from './filters.js';

var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());

function init() {
  pagestemplate.validateAuthorization();
  loadMap();
  loadPins();
  mymap.on('click', onMapClick);
  // document.getElementById('pinsTableBody').addEventListener('click', removePin);
  // document.getElementById('issuesTableBody').addEventListener('click', removeIssue);
  loadPinTypes();
  document.getElementById('selectedList').addEventListener('change', showSelectedTable);
}

//MAP FUNCTIONS
function loadMap() {
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(mymap);
}

var allPins =[];
function loadPins() {
  fetch("https://cityinventory.azure-api.net/Pins", {
    method: 'GET',
    redirect: 'follow'
  })
  .then(response => response.json())
  .then(results=> {
      for(let i = 0; i < results.data.length; i++) {
        allPins.push(results.data[i]);

        var newMarker = L.marker([results.data[i].gpsCoordX, results.data[i].gpsCoordY])
        .addTo(mymap);

        var popup = L.DomUtil.create('LI', 'options');
        popup.style.listStyle = "none";

        var title = L.DomUtil.create('h5');
        title.innerHTML = results.data[i].name;
        popup.appendChild(title);


        var changeBtn = L.DomUtil.create('a');
        changeBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        changeBtn.innerHTML = "Modifică marcaj"
        changeBtn.style.color = "white";
        changeBtn.style.display = "flex";
        changeBtn.addEventListener('click', () => {
          showInputForm(true);
          showClickedPin(results.data[i]);
          setUpdatePinBtnVisibility(true);
          document.location.href = "#editForm";
        });
        popup.appendChild(changeBtn);

        var deletePinBtn = L.DomUtil.create('a');
        deletePinBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn delete");
        deletePinBtn.innerHTML = "Șterge marcaj"
        deletePinBtn.style.color = "white";
        deletePinBtn.style.display = "flex";
        deletePinBtn.style.marginTop = "4px";
        deletePinBtn.addEventListener('click', () => {
          removePin(results.data[i].id);
        });
        popup.appendChild(deletePinBtn);

        newMarker.bindPopup(popup);
      }
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
    showClickedCoordonates(coordinates);
    setAddPinBtnVisibility(true);
    document.location.href = "#editForm";
  });

  var optionList = L.DomUtil.create('LI', 'options');
  optionList.style.listStyle ="none";
  optionList.appendChild(addPinBtn);

  L.popup().setLatLng(coordinates)
           .setContent(optionList)
           .openOn(mymap);
}



//DATA TABLES
function showSelectedTable(){
  var selectedOption = document.getElementById("selectedList").value;
  if(selectedOption=='sesizari'){
    showIssuesTable();
    hidePinsTable();
    hideWorksTable();
  }
  else if(selectedOption=='marcaj'){
    hideIssuesTable();
    showPinsTable();
    hideWorksTable();
  }
  else if(selectedOption=='lucrari'){
    hideIssuesTable();
    hidePinsTable();
    showWorksTable();
  }else{
    hideIssuesTable();
    hidePinsTable();
    showWorksTable();
  }
}

function showIssuesTable() {
  var issuesList = document.getElementById('issuesList');
  issuesList.style.display="block";

  document.getElementById('toate').addEventListener('click', showAllIssues)

  document.getElementById('cladiri').addEventListener('click', function(){
      showIssuesByPinType(1);
  });
  document.getElementById('drumuri').addEventListener('click', function(){
      showIssuesByPinType(2);
  });
  document.getElementById('spatiiDeschise').addEventListener('click', function(){
      showIssuesByPinType(3);
  });
  document.getElementById('altele').addEventListener('click', function(){
      showIssuesByPinType(4);
  });

}

function hideIssuesTable() {
  var issuesList = document.getElementById('issuesList');
  issuesList.style.display="none";
}

function showPinsTable() {
  var pinsList = document.getElementById('pinsList');
  pinsList.style.display="block";
}

function hidePinsTable() {
  var pinsList = document.getElementById('pinsList');
  pinsList.style.display="none";
}

function showWorksTable() {
  var worksList = document.getElementById('worksList');
  worksList.style.display="block";
}

function hideWorksTable() {
  var worksList = document.getElementById('worksList');
  worksList.style.display="none";
}

function removeIssue(e){
  if(e.target.classList.contains('delete')){
    const id = e.target.id;
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      mode: 'cors'
    };

    fetch(`https://cityinventory.azure-api.net/Issues/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        alert('Solicitatea a fost inregistrata.');
        location.reload();
      })
      .catch(error => {
        console.log('error', error)
        alert('Sesizarea nu a fost stearsa. Te rugăm sa încerci din nou.');
      });
  }
}


//PIN EDITOR FORM
function loadPinTypes() {
  fetch("https://cityinventory.azure-api.net/PinTypes", {
    method: 'GET',
    redirect: 'follow'
  })
    .then(response => response.json())
    .then(results=> {
      var selector = document.getElementById("categoryMaster");
      for(let i = 0; i < 4; i++) {
        var option = document.createElement("option");
        option.text = results.data[i].id + "_" + results.data[i].name;
        selector.add(option);
      }
    })
    .catch(error => console.log('error', error));
}

function showInputForm(isVisible) {
  var formElement = document.getElementById("editForm");
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
  var formElement = document.getElementById("editForm");
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

function showClickedPin (pin) {
  var idElement = document.getElementById('pinCode');
  idElement.value = pin.id;

  var pinTypeId = document.getElementById('categoryMaster');
  for (var i=0; i<pinTypeId.options.length; i++ ) {
    if (pinTypeId[i].text.startsWith(pin.pinTypeId)) {
      pinTypeId.selectedIndex = i;
    }
  }

  var titleElement = document.getElementById('nume');
  titleElement.value = pin.name;

  var descriptionElement = document.getElementById('pinDescription');
  descriptionElement.value = pin.description;

  var coordinates = {lat: pin.gpsCoordX, lng: pin.gpsCoordY }
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
  const pinId = idElement.value;

  const description = document.getElementById('pinDescription').value;
  const name = document.getElementById('nume').value;
  const isHeritage = document.getElementById('isHeritage').checked;

  var selector = document.getElementById("categoryMaster");
  const selectedOption = selector.value;
  const pinType = parseInt(selectedOption.split('_')[0]);

  let latitude = document.getElementById('latitude').value;
  let longitude = document.getElementById('longitude').value;

  if(latitude==null || latitude=='' || longitude==null || longitude=='') {
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
  fetch("https://cityinventory.azure-api.net/Pins", {
    method: 'POST',
    headers: {
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  })
  .then(response => response.text())
  .then(result => {
    alert('Solicitatea a fost înregistrată.');
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
  fetch(`https://cityinventory.azure-api.net/Pins/`+idPin, {
    method: 'PUT',
    headers: {
      "Content-Type": "text/json"
    },
    mode: 'cors',
    body: message
  })
  .then(response => response.text())
  .then(result => {
    alert('Solicitatea a fost înregistrată.');
    location.reload();
  })
  .catch(error => {
    console.log('error', error)
    alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
  });
}

//PIN ACTIONS
function removePin(pinId){

    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      mode: 'cors'
    };

    fetch(`https://cityinventory.azure-api.net/Pins/${pinId}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      alert('Solicitatea a fost înregistrată.');
      location.reload();
    })
    .catch(error => {
      console.log('error', error)
      alert('Marcajul nu a fost sters de pe harta. Te rugăm sa încerci din nou.');
    });
}
  