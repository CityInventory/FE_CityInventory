class PAGESTEMPLATE {
    constructor() {
        this.pins = document.getElementById('pins');
        this.id = document.getElementById('id');
        this.name = document.getElementById('name');
        this.gpsCoordX = document.getElementById('gpsCoordX');
        this.gpsCoordY = document.getElementById('gpsCoordY');
        this.description = document.getElementById('description');
        this.pinDetails = document.getElementById('pinDetails');
        this.tableBody = document.getElementById('table-body');
    }


showPinDetails(pin) {

let output = '';

    output += `
    <div class="pin-details-card">

    <h2 class="card-title1">${pin.name}</h2>
    <h5 class="card-description">${pin.description}</h5>
    <h6 class="coordinates">${pin.gpsCoordX}</h6>
    <h6 class="coordinates">${pin.gpsCoordY}</h6>
    <button onclick="window.location.href='patrimoniu.html'"  id="continueHome" type="button">Inapoi la Patrimoniu</button>
    <button onclick="window.location.href='sesizari.html'"  id="continueHome" type="button">Sesizare noua</button>

    </div>
    `
    this.pinDetails.innerHTML = output;
}


showAllPins(pinsArray) {
    
        let output = '';
        pinsArray.forEach((pin) => {
            output = `
            <table id="table-admin">
            <tbody> 
            <tr>
                <td>${pin.id}</td>
                <td>${pin.name}</td>
                <td>${pin.gpsCoordX}</td>
                <td>${pin.gpsCoordY}</td>
                <td><button id=${pin.id} type="button" href='detalii.html' class="card-button delete">Detalii</button></td>
                <td><button id=${pin.id} type="button" class="card-button delete">Sterge</button></td>
           </tr>
        </tbody>   
        </table> 
        `;
        this.tableBody.innerHTML += output;
        });
    }


}

export const pagestemplate = new PAGESTEMPLATE();

