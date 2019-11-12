export function round(value, precision) {
    const base = 10 ** precision;
    const a = Math.trunc(value);
    return a + Math.round((value - a) * base) / base;
}

export function assignOptions(obj, options) {
    for (let key in options) {
        if (options.hasOwnProperty(key)) {
            // @ts-ignore
            obj[key] = options[key];
        }
    }
}
