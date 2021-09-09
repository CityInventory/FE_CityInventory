export function User(name, key, role) {
    this.name = name;
    this.key = key;
    this.role = role;
}

export function userFromJson(rawData) {
    return JSON.parse(rawData);
}