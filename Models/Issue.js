export function Issue(rawData) {
    this.id = rawData.id;
    this.details = rawData.details;
    this.photo = rawData.photo;
    this.pinId = rawData.pinId;
    this.statusId = rawData.statusId;
    this.date = rawData.date;
}