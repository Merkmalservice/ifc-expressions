import { ExprType } from "../type/ExprType.js";

export interface Value<T> {
  getValue(): T;
  equals(other: Value<any>): boolean;
  toString();
  getType(): ExprType;
}
