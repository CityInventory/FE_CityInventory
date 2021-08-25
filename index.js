import {getAllIssues} from "./Services/IssueService.js";
import {Issue} from "./Models/Issue.js";

window.addEventListener('load', init);

function init() {
  getAllIssues().then(issues => {
    showLatestIssues(issues);
    showIssuesPie(issues);
  });
}

function showLatestIssues(issueList) {
  let newsElement = document.getElementById('news');
  newsElement.innerHTML = '';
  let details = document.getElementById('news-content');
  let sortedIssues = sortIssuesDescendingByDate(issueList);
  for (let i = 0; i <= 5; i++) {
    let output = `
        <ul class="card-contor">
            <li>
                ${sortedIssues[i].date.toDateString()} -
                ${sortedIssues[i].details}
            </li>
        </ul>
        `;
    newsElement.innerHTML += output;
  }
}

function sortIssuesDescendingByDate(issueList) {
  return issueList.map( issueData => new Issue(issueData)).sort((firstEl, secondEl) => {
    return firstEl.date < secondEl.date ? 1 : firstEl.date > secondEl.date ? -1 : 0;
  });
}

function showIssuesPie(issueList) {
  google.charts.load("current", {packages: ["corechart"]});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    let data = google.visualization.arrayToDataTable([
      ['Categorie', 'Total sesizări'],
      ['În așteptare', issueList.filter(issue => issue.statusId == 1).length],
      ['În lucru', issueList.filter(issue => issue.statusId == 2).length],
      ['Finalizate', issueList.filter(issue => issue.statusId == 3).length],
    ]);

    let options = {
      pieHole: 0.4,
    };

    let chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
  }

};







