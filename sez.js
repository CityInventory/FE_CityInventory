var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());

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

function showInputForm(isVisible) {
  var formElement = document.getElementById("editForm");
  if (isVisible) {
    formElement.style.display = "block"; 
  } else {
    formElement.style.display = "none";
  }
}

function loadPins() {
  fetch("https://cityinventory.azure-api.net/Pins", {
    method: 'GET',
    redirect: 'follow'
  })
  .then(response => response.json())
  .then(results=> {
      for(let i = 0; i < results.data.length; i++) {
        var newMarker = L.marker([results.data[i].gpsCoordX, results.data[i].gpsCoordY]).addTo(mymap);

        var popup = L.DomUtil.create('LI', 'options');
        popup.style.listStyle = "none";

        var title = L.DomUtil.create('h5');
        title.innerHTML = results.data[i].name;
        popup.appendChild(title);

        var details = L.DomUtil.create('a');
        details.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        details.setAttribute("href", "detalii.html?id="+results.data[i].id);
        details.innerHTML = "Detalii"
        popup.appendChild(details);

        var addIssueBtn = L.DomUtil.create('button');
        addIssueBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        addIssueBtn.innerHTML = "Adauga sesizare"
        addIssueBtn.addEventListener('click', () => { 
          document.getElementById('pinID').value = results.data[i].id;
          showInputForm(true);
          document.location.href = "#editForm";
        });
        popup.appendChild(addIssueBtn);

        var issues = L.DomUtil.create('a');
        issues.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        issues.setAttribute("href", "#issueList");
        issues.innerHTML = "Lista sesizari"
        popup.appendChild(issues);

        newMarker.bindPopup(popup);
      }
  })
  .catch(error => console.log('error', error));
}

function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  
  const pinId = data.get('pinID');
  const description = data.get('message');
  if (!description) {
    document.getElementById('pinDescription').style.border = '2px solid red';
    alert('Va rugam adaugati o descrirere a sesizarii dumneavoastra.');

    return;
  }
  
  var message = JSON.stringify({
    "id": 0,
    "details": description,
    "photo": '',
    "pinId": pinId,
  });
  postIssue(message);
}

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
  fetch("https://cityinventory.azure-api.net/Issues", requestOptions)
  .then(response => response.text())
  .then(result => { 
    console.log(result); 
    alert('Solicitatea a fost inregistrata.');
    showInputForm(false);
    window.location= window.location.origin + window.location.pathname;
  })
  .catch(error => { 
    console.log('error', error)
    alert('Ceva nu a mers bine. Te rugam sa incerci din nou.');
    clear();
  });
}

function loadIssues() {
  var issuesList = document.getElementById('issueList');
  fetch("https://cityinventory.azure-api.net/Issues", {
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
      if (results.data.length > 0) {
        document.getElementById("issueList").style.display = "block";
      }
  })
  .catch(error => console.log('error', error));
}

function init() {
  console.log(window.location.href);
  console.log(window.location.ancestorOrigins);
  console.log(window.location.pathname);
  console.log(window.location.origin);
  loadMap();
  loadPins();
  loadIssues();

  document
  .getElementById('pinCreateForm')
  .addEventListener('submit', handleSubmit);
}

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