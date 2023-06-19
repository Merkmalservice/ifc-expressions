export function nullish(val: any) {
        return typeof val !== 'undefined' && val !== null;
}

export function notNullish(val: any): boolean {
        return nullish(val);
}