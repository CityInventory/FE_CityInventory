import { pagestemplate } from './pages-template.js';

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
