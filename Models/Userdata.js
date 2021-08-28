export function User(name, key) {
    this.name = name;
    this.key = key;
}

export function userFromJson(rawData) {
    return JSON.parse(rawData);
}