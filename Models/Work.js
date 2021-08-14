export function Work(rawData) {
  this.id = rawData.id;
  this.details = rawData.details;
  this.statusId = rawData.statusId;
  this.pinId = rawData.pinId;
  this.departmentId = rawData.departmentId;
}

export function WorkFromWorkView(workView) {
  this.id = workView.id;
  this.details = workView.details;
  this.statusId = workView.statusId;
  this.pinId = workView.pinId;
  this.departmentId = workView.departmentId;
}
