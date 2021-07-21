import { pagestemplate } from './pages-template.js';

window.onload = () => {
	if (window.location.search !== '') {
		const id = window.location.search.split('=')[1];
        console.log("found id="+id);
        fetch("https://cityinventory.azure-api.net/Pins/"+id, {
            method: 'GET',
            redirect: 'follow'
        })
        .then(response => response.json())
        .then(results=> {
            console.log(results.data);
            pagestemplate.showPinDetails(results.data)
        })
        .catch(error => console.log('error', error));        
	}
}

