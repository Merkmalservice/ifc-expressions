import { BoxedValueTypes } from "./BoxedValueTypes.js";
import { ExprType } from "../type/ExprType.js";
import { ValueType } from "./ValueType";

export interface Value<
  T extends
    | ValueType
    | BoxedValueTypes
    | Array<Value<BoxedValueTypes | Array<Value<BoxedValueTypes>>>>
> {
  getValue(): T;
  equals(other: Value<any>): boolean;
  toString();
  getType(): ExprType;
}
