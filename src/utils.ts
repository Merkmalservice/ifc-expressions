export function notNullish(val: any): boolean {
        return typeof val !== 'undefined' && val !== null;
}