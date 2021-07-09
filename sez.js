var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);
var marker = L.marker([45.7489, 21.2087 -0.09]).addTo(mymap);


// var popup = new L.marker();

// function onMapClick(e) {
//     marker
//         .bindPopup("Ai selectat ").openPopup()
//         .setLatLng(e.latlng)
//         // .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }

// mymap.on('click', onMapClick);

var markers = []

fetch("https://cityinventory.azure-api.net/Pins", {
  method: 'GET',
  redirect: 'follow'
})
.then(response => response.json())
.then(results=> {
    for(let i = 0; i < results.data.length; i++) {
      var newMarker = L.marker([results.data[i].gpsCoordX, results.data[i].gpsCoordY])
      .bindPopup("<h5>"+results.data[i].name+"</h5>"+"<br>"+"<a href='detalii.html?id="+results.data[i].id+"' class='btn btn-info btn-fill btn-wd'>Vezi detalii</a>"
      +"<br>"+"<br>"+
      "<a href='sesizari.html#editForm' class='btn btn-info btn-fill btn-wd' style='margin-bottom: 2px;' id='addSezBtn'>Adauga sesizare</a>" + 
      "<br>"+"<br>"+
      "<a href='sesizari.html#editForm' class='btn btn-info btn-fill btn-wd'>Vezi sesizari</a>")      
      .addTo(mymap);
      newMarker.addEventListener('click',logPosition);
      markers.push(results.data[i]);        
    }
})
.catch(error => console.log('error', error));


function logPosition(e) {
  let coordinates = e.latlng;

  for(let i = 0; i < markers.length; i++) {
    if (markers[i].gpsCoordX == coordinates.lat && markers[i].gpsCoordY == coordinates.lng) {
      document.getElementById('pinID').value = markers[i].id;
      break;
    }
  }  
}  

// var editForm = document.getElementById('editForm');
// var addSezBtn = document.getElementById('addSezBtn');

// addSezBtn.addEventListener('click', showForm);

// function showForm() {
//   editForm.style.visibility='visible'
// }


function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  
  const pinId = data.get('pinID');
  const description = data.get('message');
  
  var message = JSON.stringify({
    "id": 0,
    "details": description,
    "photo": '',
    "pinId": pinId,
  });
  postIssue(message);
  location.reload();
}

const form = document.getElementById('pinCreateForm');
form.addEventListener('submit', handleSubmit);

function postIssue(message) {
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json", 
      "Access-Control-Allow-Origin": '*'},
    mode: 'cors',
    body: message,
    redirect: 'follow'
  };    
  fetch("https://cityinventory.azure-api.net/v1/Issues", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  alert('Solicitatea a fost inregistrata.');
}

function loadIssues() {
  var issuesList = document.getElementById('issueList');
  fetch("https://cityinventory.azure-api.net/v1/Issues", {
    method: 'GET',
    redirect: 'follow'
  })
  .then(response => response.json())
  .then(results=> {
      for(let i = 0; i < results.data.length; i++) {
        var record = document.createElement("LI");
        record.innerHTML = '<b>Marcaj:</b> ' + results.data[i].pinId + "     <b>Descriere:</b> "+ results.data[i].details;
        issuesList.appendChild(record);   
      }
  })
  .catch(error => console.log('error', error));
}


loadIssues();

// var requestOptions = {
//   method: 'GET',
//   redirect: 'follow'
// };

// fetch("https://cityinventory.azure-api.net/Pins", requestOptions)
//   .then(response => response.json())
//   .then(results=> {
//       for(let i = 0; i < results.data.length; i++) {
//           if (isDesiredPinType(results.data[i].pinTypeId)) {
//               L.marker([results.data[i].gpsCoordX, results.data[i].gpsCoordY])
//               .bindPopup("<h5>"+results.data[i].name+"</h5>"+"<br>"+"<a href='detalii.html?id="+results.data[i].id+"' class='btn btn-info btn-fill btn-wd'>Vezi detalii</a>")
//               .addTo(mymap);
//           }
//       }
//   })
//   .catch(error => console.log('error', error));
// function isDesiredPinType(pinType){
//   if(pinType==4){
//       return true;
//   }
//   if(pinType==7){
//       return true;
//   }
//   if(pinType==8){
//       return true;
//   }
//   if(pinType==9){
//       return true;
//   }
//   if(pinType==10){
//       return true;
//   }
//   if(pinType==11){
//       return true;
//   }
//   if(pinType==13){
//       return true;
//   } return false;
// }