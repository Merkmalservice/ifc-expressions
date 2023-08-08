import { BoxedValueTypes } from "./BoxedValueTypes.js";
import { ExprType } from "../type/ExprType.js";

export interface Value<
  T extends
    | BoxedValueTypes
    | Array<Value<BoxedValueTypes | Array<Value<BoxedValueTypes>>>>
> {
  getValue(): T;
  equals(other: Value<any>): boolean;
  toString();
  getType(): ExprType;
}
