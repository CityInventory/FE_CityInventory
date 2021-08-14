class PAGESTEMPLATE {
  constructor() {
    this.pins = document.getElementById('pins');
    this.id = document.getElementById('id');
    this.name = document.getElementById('name');
    this.gpsCoordX = document.getElementById('gpsCoordX');
    this.gpsCoordY = document.getElementById('gpsCoordY');
    this.details = document.getElementById('details');
    this.pinDetails = document.getElementById('pinDetails');
    this.pinList = document.getElementById('pinList');
    this.issuesList = document.getElementById('issuesList');
    this.issuesTable = document.getElementById('issues-table');
    this.pinsTableBody = document.getElementById('pinsTableBody');
    this.worksTableBody = document.getElementById('worksTableBody');

  }


  showPinDetails(pin) {

    let output = '';

    output += `
        <h2 class="card-title1">${pin.name}</h2>
        <h5 class="card-description">${pin.description}</h5>
    `
    this.pinDetails.innerHTML = output;

  }

  //added by Ale
  showPins(pinsArray) {
    this.pinsTableBody.innerHTML = '';
    let output = '';
    pinsArray.forEach((pin) => {
      output = `
            <tr>
                <td>${pin.id}</td>
                <td>${pin.pinTypeId}</td>
                <td>${pin.name}</td>
                <td class="btn-group">
                    <button id=${pin.id} type="button" onclick="window.location.href='detalii.html?id=${pin.id}'"
                    class="btn btn-sm btn-round btn-primary table-btn btn-primary-customization">
                        Detalii
                    </button>
<!--                    <button id=${pin.id} type="button" href='detalii.html' class="btn btn-sm btn-round btn-fill btn-default table-btn">Modifică</button>-->
<!--                    <button id=${pin.id} type="button" class="btn btn-sm btn-round btn-fill btn-default table-btn">Șterge</button>-->
                </td>
            <tr>
        `;
      this.pinsTableBody.innerHTML += output;
    });
  }

  //added by Ale
  showWorks(worksArray) {
    this.worksTableBody.innerHTML = '';
    let output = '';
    worksArray.forEach((work) => {
      output = `
            <tr>
                <td>${work.pinId}</td>
                <td>${work.statusId}</td>
                <td>${work.details}</td>
                <td class="btn-group">
<!--                    <button id=${work.id} type="button" href='detalii.html' class="btn btn-sm btn-round btn-fill btn-default table-btn">Modifică</button>-->
<!--                    <button id=${work.id} type="button" class="btn btn-sm btn-round btn-fill btn-default table-btn">Șterge</button>-->
                </td>
            <tr>
            `;
      this.worksTableBody.innerHTML += output;
    });
  }


  isAuthorized() {
    var userName = getCookie(cookieName);
    return (userName != null)
  }

  validateAuthorization() {
    if (!this.isAuthorized()) {
      alert("Nu ai acces la acest conținut. Loghează-te folosind butonul de 'Autentificare'")
      window.location.href = "index.html";
    }
  }
}

export const pagestemplate = new PAGESTEMPLATE();

