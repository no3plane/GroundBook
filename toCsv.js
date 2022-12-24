export function getCsvHead(obj) {
    return Object.keys(obj).join(',') + ',';
}

export function getCsvColNames(obj) {
    return Object.keys(obj);
}

export function getCsvRow(keys, obj) {
    let result = '';
    for (let key of keys) {
        if (obj[key] === undefined) {
            result += ',';
        } else {
            result += obj[key] + ',';
        }
    }
    return result;
}