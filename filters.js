import { pagestemplate } from './pages-template.js';
document.addEventListener('DOMContentLoaded', showAllIssues);

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

function showIssuesByPinType(selectedPinType) {
    let url = "https://cityinventory.azure-api.net/Issues/pinType/"+ selectedPinType
    showIssuesList(url);
}

function showAllIssues() {
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
