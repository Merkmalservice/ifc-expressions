export function isNullish(val: any) {
  return typeof val === "undefined" || val === null;
}

export function isPresent(val: any): boolean {
  return !isNullish(val);
}
