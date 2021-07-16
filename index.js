var title = document.getElementById('news-title');
var details = document.getElementById('news-content');
var news = document.getElementById('news');
var currentNews = document.getElementById('currentNewsPage');
var newsData;
var currentIndex;
var newData;

var dot1 = document.getElementById('dot1');
var dot2 = document.getElementById('dot2');
var dot3 = document.getElementById('dot3');



document.addEventListener('DOMContentLoaded', startTimers);

	
function showPage (data, startIndex) {
    let pageElement = document.getElementById('news');
    endIndex = startIndex + 4;
    pageElement.innerHTML = '';
    for (let i = startIndex; i <= endIndex; i++) {
        let output = `
        <div class="card">
        <h3>${data[i].id}</h3>
        <h3>${data[i].date}</h3>
        <h3>${data[i].statusId}</h3>
        <h4>${data[i].details}</h4>
        </div>
        `;            
        pageElement.innerHTML += output;
    }
}

function showNews() {
    fetch ("https://cityinventory.azure-api.net/Issues", {
        method: 'GET',
        redirect: 'follow'
    })
    .then(response => response.json())
    .then(results => { newData = results.data; })
	.then(() => {
        currentIndex=0;
        showPage(newData, currentIndex);
    });     
}
 function dot1Clicked() {
     currentIndex=0;
     showPage(newData, currentIndex);
 }

 function dot2Clicked() {
     currentIndex=5;
    showPage(newData, currentIndex);
}

function dot3Clicked() {
    currentIndex=10;
    showPage(newData, currentIndex);
}

function goToNextPage() {
    currentIndex=currentIndex+5;
    if(currentIndex>10) {
        currentIndex=0
    }
    showPage(newData, currentIndex);
}

function startTimers() {
         showNews();
         setInterval(goToNextPage, 15000);
         setInterval(showNews, 180000);
}