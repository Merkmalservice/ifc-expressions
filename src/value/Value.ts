import { PrimitiveValueType } from "./PrimitiveValueType.js";

export interface Value<
  T extends
    | PrimitiveValueType
    | Array<Value<PrimitiveValueType | Array<Value<PrimitiveValueType>>>>
> {
  getValue(): T;
  equals(other: Value<any>): boolean;
}
