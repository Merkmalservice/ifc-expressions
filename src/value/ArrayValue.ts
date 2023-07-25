import { Value } from "./Value";

export class ArrayValue implements Value<Array<Value<any>>> {
  private readonly arrayValue: Array<Value<any>>;

  constructor(value: Array<Value<any>>) {
    this.arrayValue = value;
  }

  public static of(value: Array<Value<any>>): ArrayValue {
    return new ArrayValue(value);
  }

  getValue(): Array<Value<any>> {
    return this.arrayValue;
  }

  equals(other: Value<any>): boolean {
    return (
      ArrayValue.isArrayValueType(other) &&
      other.arrayValue.every((val, ind) => val.equals(this.arrayValue[ind]))
    );
  }

  public static isArrayValueType(arg: any): arg is ArrayValueType {
    return Array.isArray(arg.arrayValue);
  }
}

export type ArrayValueType = {
  arrayValue: Array<Value<any>>;
};
