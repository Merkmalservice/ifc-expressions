export function isNullish(val: any) {
  return typeof val === "undefined" || val === null;
}

export function isPresent(val: any): boolean {
  return !isNullish(val);
}

export function isFunction(val: any): boolean {
  return typeof val === "function";
}
