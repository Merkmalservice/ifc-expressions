import { Value } from "./Value.js";

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

  toString(): string {
    return (
      "[" +
      this.arrayValue
        .map((e) => {
          if (typeof e["toString"] === "function") {
            return e.toString();
          } else {
            return "" + e;
          }
        })
        .join(", ") +
      "]"
    );
  }

  public static isArrayValueType(arg: any): arg is ArrayValueType {
    return Array.isArray(arg.arrayValue);
  }
}

export type ArrayValueType = {
  arrayValue: Array<Value<any>>;
};
