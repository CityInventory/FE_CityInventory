export function arrayToSeparatedString(...data) {
  return data.join(' - ');
}

export function separatedStringToArray(separatedString) {
  return separatedString.split(' - ');
}
