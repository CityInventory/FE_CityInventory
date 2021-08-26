import {getPinsById} from "./Services/PinService.js";

window.addEventListener('load', init);

function init() {
	if (window.location.search !== '') {
		const id = window.location.search.split('=')[1];
    getPinsById(id)
    .then(results=> {
        showPinDetails(results.data)
    })
    .catch(error => console.log('error', error));
	}
}

function showPinDetails(pin) {
  let output = '';
  output += `
        <h2 class="card-title1">${pin.name}</h2>
        <h5 class="card-description">${pin.description}</h5>
    `;
  document.getElementById('pinDetails').innerHTML = output;
}

