import { pagestemplate } from './pages-template.js';

document.addEventListener('DOMContentLoaded', () => {
    if (pagestemplate.isAuthorized()) {
        showAllIssues();
        showAllPins();
        showAllWorks();
    }
});

export function showIssuesByPinType(selectedPinType) {
    let url = "https://cityinventory.azure-api.net/Issues/pinType/"+ selectedPinType
    showIssuesList(url);
}

export function showAllIssues() {
    showIssuesList("https://cityinventory.azure-api.net/Issues");
}

function showIssuesList(url){
fetch ( url ,{
    method: 'GET',
    redirect: 'follow'
    })
    .then(response => response.json())
    .then(results=> {
        pagestemplate.showIssues(results.data);
    })
    .catch(error => console.log('error', error));       
}

//added by ale
document.getElementById('pinsTableBody')
function showPinsbyPinType(selectedPinType) {
    let url = "https://cityinventory.azure-api.net/Pins/type/"+ selectedPinType
    showPinsList(url);
}

function showAllPins() {
    showPinsList("https://cityinventory.azure-api.net/Pins");
}

function showPinsList(url){
fetch ( url ,{
    method: 'GET',
    redirect: 'follow'
    })
    .then(response => response.json())
    .then(results=> {
        pagestemplate.showPins(results.data);
    })
    .catch(error => console.log('error', error));       
}

//added by ale
document.getElementById('worksTableBody')
function showWorksByPinId(selectedStatus) {
    let url = "https://cityinventory.azure-api.net/Works/pinID"+ selectedPinId
    showWorkList(url);
}

function showAllWorks() {
    showWorkList("https://cityinventory.azure-api.net/Works");
}

function showWorkList(url){
fetch ( url ,{
    method: 'GET',
    redirect: 'follow'
    })
    .then(response => response.json())
    .then(results=> {
        pagestemplate.showWorks(results.data);
    })
    .catch(error => console.log('error', error));       
}