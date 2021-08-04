export function IssueView(pin, issue, status) {
    this.pinId = pin.id;
    this.pinTypeId = pin.pinTypeId;
    this.pinName = pin.name;
    this.issueId = issue.id;
    this.statusId = status.id;
    this.status = status.name;
    this.description = issue.details;
    this.date = issue.date;
}

export function getIssuesViewArray(issues, pins, status) {
    let result = [];
    issues.forEach(issue => {
        let pinForIssue = pins.find(pin => pin.id == issue.pinId);
        let statusForIssue = status.find(st => st.id == issue.statusId);
        result.push(new IssueView(pinForIssue, issue, statusForIssue));
    });
    return result;
}