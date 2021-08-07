import {
  showAllIssues,
  showIssuesByPinType,
  showIssueInputForm,
  createEventsForIssueFormButtons,
  loadMap
} from './map-page-template.js';
import {getAllPins} from "./Services/PinService.js";

var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);
window.addEventListener('load', init());

function init() {
  loadMap(mymap);
  loadPins();
  showAllIssues();

  document.getElementById('toate').addEventListener('click', showAllIssues)

  document.getElementById('cladiri').addEventListener('click', function () {
    showIssuesByPinType(1);
  });
  document.getElementById('drumuri').addEventListener('click', function () {
    showIssuesByPinType(2);
  });
  document.getElementById('spatiiDeschise').addEventListener('click', function () {
    showIssuesByPinType(3);
  });
  document.getElementById('altele').addEventListener('click', function () {
    showIssuesByPinType(4);
  });

  createEventsForIssueFormButtons();
}

//MAP FUNCTIONS
function loadPins() {
  getAllPins()
    .then(pinsList => {
      pinsList.forEach(pin => {
        var newMarker = L.marker([pin.gpsCoordX, pin.gpsCoordY]).addTo(mymap);

        var popup = L.DomUtil.create('LI', 'options');
        popup.style.listStyle = "none";

        var title = L.DomUtil.create('h5');
        title.innerHTML = pin.name;
        popup.appendChild(title);

        var details = L.DomUtil.create('a');
        details.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        details.setAttribute("href", "detalii.html?id=" + pin.id);
        details.innerHTML = "Detalii"
        popup.appendChild(details);

        var addIssueBtn = L.DomUtil.create('a');
        addIssueBtn.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        addIssueBtn.innerHTML = "Adaugă sesizare"
        addIssueBtn.style.color = "white";
        addIssueBtn.addEventListener('click', () => {
          document.getElementById('issue-form-pin-id').value = pin.id;
          showIssueInputForm(true);
        });
        popup.appendChild(addIssueBtn);

        var issues = L.DomUtil.create('a');
        issues.setAttribute("class", "btn btn-info btn-fill btn-wd options-btn");
        issues.setAttribute("href", "#filter-select-buttons");
        issues.innerHTML = "Listă sesizări"
        popup.appendChild(issues);

        newMarker.bindPopup(popup);
      })
    })
    .catch(error => console.log('error', error));
}

