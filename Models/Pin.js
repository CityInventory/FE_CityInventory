export function Pin(rawData) {
    this.id = rawData.id;
    this.pinTypeId = rawData.pinTypeId;
    this.gpsCoordX = rawData.gpsCoordX;
    this.gpsCoordY = rawData.gpsCoordY;
    this.description = rawData.description;
    this.name = rawData.name;
    this.isHeritage = rawData.isHeritage;
}