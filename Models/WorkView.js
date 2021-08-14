export function WorkView(work, pin, status, department) {
  this.id = work.id;
  this.details = work.details;
  this.statusId = status.id;
  this.status = status.name;
  this.pinId = pin.id;
  this.pinName = pin.name;
  this.departmentId = department.id;
  this.departmentName = department.name;
}

export function getWorkViewArray(workList, pins, status, departments) {
  let result = [];
  workList.forEach(work => {
    let foundPin = pins.find(pin => pin.id == work.pinId);
    let foundStatus = status.find(st => st.id == work.statusId);
    let foundDepartment = departments.find(dep => dep.id == work.departmentId);
    result.push(new WorkView(work, foundPin, foundStatus, foundDepartment));
  });
  return result;
}
