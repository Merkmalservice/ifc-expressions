import { ObjectAccessor } from "../context/ObjectAccessor.js";
import { Value } from "./Value.js";
import { isNullish } from "../IfcExpressionUtils.js";

export class ObjectAccessorValue implements Value<ObjectAccessor> {
  private readonly objectAccessorValue: ObjectAccessor;

  constructor(objectAccessorValue: ObjectAccessor) {
    this.objectAccessorValue = objectAccessorValue;
  }

  public static of(value: ObjectAccessor): ObjectAccessorValue {
    return new ObjectAccessorValue(value);
  }

  getValue(): ObjectAccessor {
    return this.objectAccessorValue;
  }

  equals(other: Value<any>): boolean {
    return this.objectAccessorValue === other?.getValue();
  }

  static isObjectAccessorValueType(arg: any): arg is ObjectAccessorValue {
    return (
      !isNullish(arg) &&
      !isNullish(arg.objectAccessorValue) &&
      arg.objectAccessorValue instanceof ObjectAccessorValue
    );
  }
}
