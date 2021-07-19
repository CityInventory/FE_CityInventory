import { pagestemplate } from './pages-template.js';




var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());
var markers = []

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

        var newMarker = L.marker([results.data[i].gpsCoordX, results.data[i].gpsCoordY]).addTo(mymap);

        var popup = L.DomUtil.create('LI', 'options');
        popup.style.listStyle = "none";

        var title = L.DomUtil.create('h5');
        title.innerHTML = results.data[i].name;
        popup.appendChild(title);

        var changeBtn = L.DomUtil.create('button');
        addIssueBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        changeBtn.innerHTML = "Modifica marcaj"
        changeBtn.addEventListener('click', () => { 
          document.getElementById('pinID').value = results.data[i].id;
          showInputForm(true);
          document.location.href = "#editForm";
        });
        popup.appendChild(changeBtn);

        var deletePinBtn = L.DomUtil.create('a');
        deletePinBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        deletePinBtn.addEventListener('click', removePin)
        deletePinBtn.innerHTML = "Sterge marcaj"
        popup.appendChild(deletePinBtn);

        newMarker.bindPopup(popup);
      }
  })
  .catch(error => console.log('error', error));
}


//Functionality for pins
// function loadPins() {
//   var requestOptions = {
//     method: 'GET',
//     redirect: 'follow'
//   };

//   fetch("https://cityinventory.azure-api.net/Pins", requestOptions)
//     .then(response => response.json())
//     .then(results=> {
//       for(let i = 0; i < results.data.length; i++) {
//         var newMarker = L.marker([results.data[i].gpsCoordX, results.data[i].gpsCoordY])
//         .bindPopup(results.data[i].name+"<hr>"+
//         "<a href='administrare.html#editForm' class='btn btn-info btn-fill btn-wd' style='margin-bottom: 2px;'>Sterge Marcaj</a>"+ "<br>" + "<br>" +
//         "<a href='administrare.html#editForm' class='btn btn-info btn-fill btn-wd' id='changeBtn'>Modifica descriere</a>")
//         .addTo(mymap);
//         newMarker.addEventListener('click',logPosition);
//         markers.push(results.data[i]);
//       }
//     })
//     .catch(error => console.log('error', error));
// }

function logPosition(e) {
  let coordinates = e.latlng;
  var latElement = document.getElementById('latitude');
  latElement.value = coordinates.lat;
  latElement.style.border = '1px solid black';      
  var lngElement = document.getElementById('longitude');
  lngElement.value = coordinates.lng;        
  lngElement.style.border = '1px solid black';   

  for(let i = 0; i < markers.length; i++) {
    if (markers[i].gpsCoordX == latElement.value && markers[i].gpsCoordY == lngElement.value) {
      document.getElementById('pinDescription').value = markers[i].description;
      break;
    }
  }  
}

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
                console.log(result);
              })
              .catch(error => { 
                console.log('error', error);
              });
              alert('Solicitatea a fost inregistrata.');
          }
          location.reload();
        }
        

  
// function removePin() {
//   var latElement = document.getElementById('latitude');
//   var lngElement = document.getElementById('longitude');
//   for(let i = 0; i < markers.length; i++) {
//     if (markers[i].gpsCoordX == latElement.value && markers[i].gpsCoordY == lngElement.value) {
//       var requestOptions = {
//         method: 'DELETE',
//         redirect: 'follow',
//         mode: 'cors'
//       };
      
//       fetch("https://cityinventory.azure-api.net/Pins/"+markers[i].id, requestOptions)
//         .then(response => response.text())
//         .then(result => { 
//           console.log(result);
//         })
//         .catch(error => { 
//           console.log('error', error);
//         });
//         alert('Solicitatea a fost inregistrata.');
//       break;
//     }
//   }
//   location.reload();  
// }

function updatePin() {
  var latElement = document.getElementById('latitude');
  var lngElement = document.getElementById('longitude');
  for(let i = 0; i < markers.length; i++) {
    if (markers[i].gpsCoordX == latElement.value && markers[i].gpsCoordY == lngElement.value) {
      var description = document.getElementById('pinDescription').value;
      var foundMarker = markers[i];
      foundMarker.description = description;

      var requestOptions = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json", 
          "Access-Control-Allow-Origin": '*'},
        mode: 'cors',
        body: JSON.stringify(foundMarker),
        redirect: 'follow'
      };    

      fetch("https://cityinventory.azure-api.net/Pins/"+foundMarker.id, requestOptions)
      .then(response => response.text())
      .then(result => { 
        console.log(result);
      })
      .catch(error => { 
        console.log('error', error);
      });
      alert('Solicitatea a fost inregistrata.');

      break;
    }
  }
  location.reload();  
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
    .setContent("<a href='administrare.html#editForm' id='saveBtn' class='btn btn-info btn-fill btn-wd'>Adauga Marcaj</a>")
    .openOn(mymap);

}
// saveBtn.addEventListener('click', () => { 
//   document.getElementById('pinID').value = results.data[i].id;
//   showInputForm(true);
//   document.location.href = "#editForm";
// });


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
    console.log(result);
  })
  .catch(error => {
    console.log('error', error);
  });
  alert('Solicitatea a fost inregistrata.');
}

// function showInventory() {
//     fetch ("https://cityinventory.azure-api.net/Pins", {
//       method: 'GET',
//       redirect: 'follow'
//     })
//     .then(response => response.json())
//     .then(results=> {
//         console.log(results.data);
//         pagestemplate.showAllPins(results.data)
//     })
//     .catch(error => console.log('error', error));       
// 		// .then((data) => ui.showAdminInventory(data));
// }

// document.getElementById('changeBtn').addEventListener('click',showInputForm());



// function showInputForm(isVisible) {
//   var formElement = document.getElementById("editForm");
//   if (isVisible) {
//     formElement.style.display = "block"; 
//   } else {
//     formElement.style.display = "none";
//   }
// }

function init() {
  loadMap();
  loadPins();
  mymap.on('click', onMapClick);  
  document.getElementById('tableBody').addEventListener('click', removePin);
  document.getElementById('issuesTableBody').addEventListener('click', removeIssue);
  // document.addEventListener('DOMContentLoaded', showInventory);
  document.addEventListener('DOMContentLoaded', showIssuesList);
  loadPinTypes();
}



// fetch("https://cityinventory.azure-api.net/PinTypes", {
//     method: 'GET',
//     redirect: 'follow'
//   })
//   .then(response => response.json())
//   .then(results=> {
//       var selector = document.getElementById("categoryMaster");
//       for(let i = 0; i < results.data.length; i++) {
//         var option = document.createElement("option");
//         option.text = results.data[i].id + "_" + results.data[i].name;
//         selector.add(option);
//       }

//   })
//   .catch(error => console.log('error', error));



// Functionality for Issues

 function showIssuesList() {
  fetch ("https://cityinventory.azure-api.net/Issues", {
    method: 'GET',
    redirect: 'follow'
  })
  .then(response => response.json())
  .then(results=> {
      console.log(results.data);
      pagestemplate.showIssues(results.data)
  })
  .catch(error => console.log('error', error));       
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
                console.log(result);
              })
              .catch(error => { 
                console.log('error', error);
              });
              alert('Solicitatea a fost inregistrata.');
          }
          location.reload();
        }

//Filter on pins
document.getElementById('toate').addEventListener('click', function(){
  showIssuesList();
})
document.getElementById('cladiri').addEventListener('click', function(){
  getFilterPins(1);
});
document.getElementById('drumuri').addEventListener('click', function(){
  getFilterPins(2);
});
document.getElementById('spatiiDeschise').addEventListener('click', function(){
  getFilterPins(3);
});
document.getElementById('altele').addEventListener('click', function(){
  getFilterPins(4);
});

function getFilterPins(selectedPinType){
  // var selectedPins=[];
  fetch ("https://cityinventory.azure-api.net/Issues/pinType/"+ selectedPinType, {
      method: 'GET',
      redirect: 'follow'
    })
    .then(response => response.json())
    .then(results=> {
        // selectedPins = results.data;
        console.log(results.data);
        pagestemplate.showAllIssues(results.data);
    })
    .catch(error => console.log('error', error));       
		// .then((data) => ui.showAdminInventory(data));
    
}


// function init(){
//   loadMap();
//   // loadPins();
//   // loadIssues();
// }