import { getAllIssues } from "./Services/IssueService.js";
import { Issue } from "./Models/Issue.js";
import { ResponseDataFromFetchReponse } from "./Models/ResponseData.js"
import { loadSidebar, loadFooter } from "./Pages/Templates/PageTemplate.js";
import { SidebarItemId } from "./Pages/Templates/SideBar.js";

window.addEventListener('load', init);

function init() {
  loadSidebar(SidebarItemId.Home);
  getAllIssues()
    .then(response => ResponseDataFromFetchReponse(response))
    .then(result => {
      if (result.error) {
        console.log(`Reading issues failed: ${result.error}`);
      } else {
        showLatestIssues(result.data);
        showIssuesPie(result.data);
      }
    }).catch(error => { console.log(error); });
    loadFooter();
}

function showLatestIssues(issueList) {
  if (!issueList) {
    return;
  }
  let newsElement = document.getElementById('news');
  newsElement.innerHTML = '';
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







