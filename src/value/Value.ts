import { BoxedValueTypes } from "./BoxedValueTypes.js";
import { ExprType } from "../type/ExprType.js";
import { NonBoxedValueTypes } from "./NonBoxedValueTypes.js";

export interface Value<
  T extends
    | NonBoxedValueTypes
    | BoxedValueTypes
    | Array<Value<BoxedValueTypes | Array<Value<BoxedValueTypes>>>>
> {
  getValue(): T;
  equals(other: Value<any>): boolean;
  toString();
  getType(): ExprType;
}
