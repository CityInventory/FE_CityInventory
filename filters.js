import { pagestemplate } from './pages-template.js';
import { getIssuesByPinType, getAllIssues } from './Services/IssueService.js';
import { getPinsByType, getAllPins } from './Services/PinService.js';
import { getAllStatuses } from './Services/StatusService.js';
import { getIssuesViewArray } from './Models/IssueView.js';

export function showIssuesByPinType(selectedPinType) {
    Promise.all([getIssuesByPinType(selectedPinType), getPinsByType(selectedPinType), getAllStatuses()])
        .then((values) => {
            let issueViewArray = getIssuesViewArray(values[0], values[1], values[2]);
            pagestemplate.showIssues(issueViewArray);
        });
}

export function showAllIssues() {
    Promise.all([getAllIssues(), getAllPins(), getAllStatuses()])
        .then((values) => {
            let issueViewArray = getIssuesViewArray(values[0], values[1], values[2]);
            pagestemplate.showIssues(issueViewArray);
        });    
}

function showIssuesList(url){
fetch ( url ,{
    method: 'GET',
    redirect: 'follow'
    })
    .then(response => response.json())
    .then(results=> {
        //pagestemplate.showIssues(results.data);
    })
    .catch(error => console.log('error', error));       
}

//added by ale
document.getElementById('pinsTableBody')
function showPinsbyPinType(selectedPinType) {
    let url = "https://92xjz4ismg.eu-west-1.awsapprunner.com/Pins/type/"+ selectedPinType
    showPinsList(url);
}

export function showAllPins() {
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

export function showAllWorks() {
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