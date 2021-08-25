export function Issue(rawData) {
    this.id = rawData.id ? rawData.id : 0;
    this.details = rawData.details ? rawData.details : "";
    this.photo = rawData.photo ? rawData.photo : "";
    this.pinId = rawData.pinId ? rawData.pinId : 0;
    this.statusId = rawData.statusId ? rawData.statusId : 1;
    this.date = rawData.date ? new Date(rawData.date) : new Date().toISOString();
}

export function IssueFromIssueView(issueView) {
  this.id = issueView.issueId;
  this.details = issueView.description;
  this.photo = "";
  this.pinId = issueView.pinId;
  this.statusId = issueView.statusId;
  this.date = issueView.date;
}

