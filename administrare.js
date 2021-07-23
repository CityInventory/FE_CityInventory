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
          document.getElementById('pinID').value = results.data[i].id;
          showInputForm(true);
          document.location.href = "#editForm";
        });
        popup.appendChild(changeBtn);

        var deletePinBtn = L.DomUtil.create('a');
        deletePinBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        deletePinBtn.innerHTML = "Șterge marcaj"
        deletePinBtn.style.color = "white";
        deletePinBtn.style.display = "flex";
        deletePinBtn.style.marginTop = "4px";
        deletePinBtn.addEventListener('click', removePin)
        popup.appendChild(deletePinBtn);

        newMarker.bindPopup(popup);
      }
  })
  .catch(error => console.log('error', error));
}

function onMapClick(e) {
  let coordinates = e.latlng;
  var latElement = document.getElementById('latitude');
  latElement.value = coordinates.lat;
  latElement.style.border = '1px solid black';
  var lngElement = document.getElementById('longitude');
  lngElement.value = coordinates.lng;
  lngElement.style.border = '1px solid black';

  L.popup()
    .setLatLng(coordinates)
    .setContent("<a href='administrare.html#editForm' id='saveBtn' class='btn btn-info btn-fill btn-wd'>Adaugă marcaj</a>")
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
      })
      .catch(error => {
        console.log('error', error)
        alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
      });
  }
  location.reload();
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
      for(let i = 0; i < results.data.length; i++) {
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
  } else {
    formElement.style.display = "none";
  }
}

function handleSubmit() {
  const description = document.getElementById('pinDescription').value;

  var selector = document.getElementById("categoryMaster");
  const selectedOption = selector.value;
  const pinType = parseInt(selectedOption.split('_')[0]);

  let latitude = document.getElementById('latitude').value;
  let longitude = document.getElementById('longitude').value;

  if(latitude==null || latitude=='' || longitude==null || longitude=='') {
    document.getElementById('latitude').style.border = '2px solid red';
    document.getElementById('longitude').style.border = '2px solid red';
  } else {

    var message = JSON.stringify({
      "id": 0,
      "pinTypeId": pinType,
      "gpsCoordX": latitude,
      "gpsCoordY": longitude,
      "description": description
    });
    postPin(message);
    location.reload();

  }
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
  })
  .catch(error => {
    console.log('error', error)
    alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
  });
}

//PIN ACTIONS
function removePin(e){
  if(e.target.classList.contains('delete')){
    const id = e.target.id;
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
      mode: 'cors'
    };

    fetch(`https://cityinventory.azure-api.net/Pins/${id}`+markers[i].id, requestOptions)
    .then(response => response.text())
    .then(result => {
      alert('Solicitatea a fost înregistrată.');
    })
    .catch(error => {
      console.log('error', error)
      alert('Ceva nu a mers bine. Te rugăm sa încerci din nou.');
    });
  }
  location.reload();
}


//OTHER
// function updatePin() {
//   var latElement = document.getElementById('latitude');
//   var lngElement = document.getElementById('longitude');
//   for(let i = 0; i < markers.length; i++) {
//     if (markers[i].gpsCoordX == latElement.value && markers[i].gpsCoordY == lngElement.value) {
//       var description = document.getElementById('pinDescription').value;
//       var foundMarker = markers[i];
//       foundMarker.description = description;

//       var requestOptions = {
//         method: 'PUT',
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": '*'},
//         mode: 'cors',
//         body: JSON.stringify(foundMarker),
//         redirect: 'follow'
//       };

//       fetch("https://cityinventory.azure-api.net/Pins/"+foundMarker.id, requestOptions)
//       .then(response => response.text())
//       .then(result => {
//         console.log(result);
//       })
//       .catch(error => {
//         console.log('error', error);
//       });
//       alert('Solicitatea a fost inregistrata.');

//       break;
//     }
//   }
//   location.reload();
// }




