export function round(value: number, precision: number) {
    const base = 10 ** precision;
    const a = Math.trunc(value);
    return a + Math.round((value - a) * base) / base;
}

export function assignOptions(obj: any, options: object) {
    for (let key in options) {
        if (options.hasOwnProperty(key)) {
            // @ts-ignore
            obj[key] = options[key];
        }
    }
}

export type TFunction = (...args: any[]) => any;
