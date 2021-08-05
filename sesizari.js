import {
  showAllIssues,
  showIssuesByPinType,
  showIssueInputForm,
  createEventsForIssueFormButtons
} from './map-page-template.js';

var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());

function init() {
  loadMap();
  loadPins();
  showAllIssues();

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

  createEventsForIssueFormButtons();
}

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

function loadPins() {
  fetch("https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins", {
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

        var addIssueBtn = L.DomUtil.create('a');
        addIssueBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        addIssueBtn.innerHTML = "Adaugă sesizare"
        addIssueBtn.style.color = "white";
        addIssueBtn.addEventListener('click', () => {
          document.getElementById('issue-form-pin-id').value = results.data[i].id;
          showIssueInputForm(true);
        });
        popup.appendChild(addIssueBtn);

        var issues = L.DomUtil.create('a');
        issues.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        issues.setAttribute("href", "#filter-select-buttons");
        issues.innerHTML = "Listă sesizări"
        popup.appendChild(issues);

        newMarker.bindPopup(popup);
      }
  })
  .catch(error => console.log('error', error));
}

