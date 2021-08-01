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
        <ul class="card-contor">
            <li>
                ${data[i].date}
                ${data[i].details}
            </li>
        </ul>
        `;            
        pageElement.innerHTML += output;
    }
}

function showNews() {
    fetch ("https://92xjz4ismg.eu-west-1.awsapprunner.com/Issues", {
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

// PieChart

$(document).ready(function(){

    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
    var data = google.visualization.arrayToDataTable([
    ['Categorie', 'Total sesizări'],
    ['Inițiat', 3],
    ['Vizualizat', 5],
    ['În lucru', 7],
    ['Finalizat', 9]
    ]);
    
    var options = {
    title: 'Status sesizări',
    pieHole: 0.4,
    };
    
    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
    }
    
    });







