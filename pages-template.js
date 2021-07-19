class PAGESTEMPLATE {
    constructor() {
        this.pins = document.getElementById('pins');
        this.id = document.getElementById('id');
        this.name = document.getElementById('name');
        this.gpsCoordX = document.getElementById('gpsCoordX');
        this.gpsCoordY = document.getElementById('gpsCoordY');
        this.details = document.getElementById('details');
        this.pinDetails = document.getElementById('pinDetails');
        this.tableBody = document.getElementById('tableBody');
        this.pinList = document.getElementById('pinList');
        this.issuesList = document.getElementById('issuesList');
        this.issuesTable = document.getElementById('issues-table');
        this.issuesTableBody = document.getElementById('issuesTableBody');
    }


showPinDetails(pin) {

let output = '';

    output += `
    <div class="pin-details-card">
        <h2 class="card-title1">${pin.name}</h2>
        <h5 class="card-description">${pin.description}</h5>
        <button onclick="window.location.href='sesizari.html'"  id="continueHome" type="button">Inapoi la Sesizari</button>
        <button onclick="window.location.href='sesizari.html#editForm'"  id="continueHome" type="button">Sesizare noua</button>
    </div>
    `
    this.pinDetails.innerHTML = output;

}

// showAllPins(pinsArray) {
    
//         let output = '';
//         pinsArray.forEach((pin) => {
//             output = `
//             <table id="table-admin">
//             <tbody> 
//             <tr>
//                 <td>${pin.id}</td>
//                 <td><a href = "mapid" ${pin.gpsCoordx + pin.gpsCoordY}>${pin.name}</a></td>
//                 <td><button id=${pin.id} type="button" onclick="window.location.href='detalii.html?id=${pin.id}'"  class="card-button">Detalii</button></td>
//                 <td><button id=${pin.id} type="button" href='detalii.html' class="card-button">Modifică</button></td>
//                 <td><button id=${pin.id} type="button" class="card-button delete">Șterge</button></td>
//            </tr>
//         </tbody>   
//         </table> 
//         `;
//         this.tableBody.innerHTML += output;
//         });
//     }

    showIssues(issuesArray) {
        this.issuesTableBody = '';
        let output = '';
        issuesArray.forEach((pinType) => {
            output = `
            <tr>
                <td>${pinType.id}</td>
                <td>${pinType.details}</td>
                <td><button id=${pinType.id} type="button" onclick="window.location.href='detalii.html?id=${pinType.id}'"  class="card-button">Detalii</button></td>
                <td><button id=${pinType.id} type="button" href='detalii.html' class="card-button">Modifică</button></td>
                <td><button id=${pinType.id} type="button" class="card-button delete">Șterge</button></td>
           </tr>
        `;
        this.issuesTableBody.innerHTML += output;
        });
    }


}

export const pagestemplate = new PAGESTEMPLATE();

