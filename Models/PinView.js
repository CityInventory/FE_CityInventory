export function PinView(pin, pinType) {
  this.id = pin.id;
  this.pinTypeId = pin.pinTypeId;
  this.pinTypeName = pinType.name;
  this.name = pin.name;
  this.gpsCoordX = pin.gpsCoordX;
  this.gpsCoordY = pin.gpsCoordY;
  this.description = pin.description;
  this.isHeritage = pin.isHeritage;
}

export function getPinViewArray(pins, pinTypes) {
  let result = [];
  pins.forEach(pin => {
    let pinType = pinTypes.find(type => type.id == pin.pinTypeId);
    result.push(new PinView(pin, pinType));
  });
  return result;
}
