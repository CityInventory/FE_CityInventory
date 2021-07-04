//Map -Admin//
// var mymap = L.map('mapid').setView([45.7489, 21.2087], 13);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//   maxZoom: 18,
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
//     'Imagery ©️ <a href="https://www.mapbox.com/">Mapbox</a>',
//   id: 'mapbox/streets-v11',
//   tileSize: 512,
//   zoomOffset: -1
// }).addTo(mymap);

// var marker = L.marker([45.7489, 21.2087 -0.09]).addTo(mymap);


// var popup = new L.marker();

// function onMapClick(e) {
//     marker
//         .bindPopup("Locatie selectata" + '<button type="button" onclick="displayForm">Adauga</button>').openPopup()
//         .setLatLng(e.latlng)
//         // .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }

// mymap.on('click', onMapClick);
//End of Map Admin//

//Display form on pop-up//
// function displayForm{
//     let output = '';
//     output = `
//     <tbody id="table-form"> 
//     <tr>
//         <td>
//             <img>
//         </td>
//         <td>
//             <select name="optiuni" value = "tip" id="options">
//                 <option value = "cladire">Cladire</option>
//                 <option value = "infrastructura">Infrastructura</option>
//             </select>
//         </td>
//         <td>
//             <label for = "an">An contructie</label>
//             <input id="an" type="number" min="1850"></td>
//         </td>
//         <td><label for = "adresa">Adresa</label>
//             <input id = "adresa" type="text" maxlength="150">
//         </td>
//         <td>
//             <label for = "tipDomeniu">Domeniu</label>
//             <select id="tipDomeniu">
//                 <option value="public">Public</option>
//                 <option value="privat">Privat</option>
//             </select>
//         </td>
//         <td>
//             <label for = "utilizare">Utilizare</label>
//             <select name="sediuInstitutie" id="utilizare">Sediu Institutie</select>
//             <select name="monumentIstoric" id="utilizare">Monument Istoric</select>
//         </td>
//         <td>
//             <label for="nrInventar">Numar inventar</label>
//             <input id = "adresa" type="text" maxlength="50">
//         </td>

//         <td><button type="button" id ="addInput"> Adauga</button>
//         </td>
//     </tr>
// </tbody>`;
// }

