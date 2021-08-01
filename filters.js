import { pagestemplate } from './pages-template.js';

document.addEventListener('DOMContentLoaded', () => {
    if (pagestemplate.isAuthorized()) {
        showAllIssues();
        showAllPins();
        showAllWorks();
    }
});

export function showIssuesByPinType(selectedPinType) {
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues/pinType/"+ selectedPinType
    showIssuesList(url);
}

export function showAllIssues() {
    showIssuesList("https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues");
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
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/type/"+ selectedPinType
    showPinsList(url);
}

function showAllPins() {
    showPinsList("https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins");
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
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Works/pinID"+ selectedPinId
    showWorkList(url);
}

function showAllWorks() {
    showWorkList("https://92xjz4ismg.eu-west-1.awsapprunner.com/Works");
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