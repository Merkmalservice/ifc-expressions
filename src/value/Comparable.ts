import { isFunction } from "../IfcExpressionUtils.js";

export interface Comparable<T> {
  compareTo(other: T): number;
}

export function isComparable(arg: any): arg is Comparable<unknown> {
  return isFunction(arg.compareTo);
}
