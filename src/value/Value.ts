import { BoxedValueTypes } from "./BoxedValueTypes.js";
import { ExprType } from "../type/ExprType.js";
import { ValueType } from "./ValueType";

export interface Value<
  T extends
    | ValueType
    | BoxedValueTypes
    | Record<string, unknown>
    | Array<
        Value<
          | BoxedValueTypes
          | Record<string, unknown>
          | Array<Value<BoxedValueTypes | Record<string, unknown>>>
        >
      >
> {
  getValue(): T;
  equals(other: Value<any>): boolean;
  toString();
  getType(): ExprType;
}
