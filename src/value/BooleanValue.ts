import { Value } from "./Value.js";

export class BooleanValue implements Value<boolean> {
  private readonly booleanValue: boolean;

  constructor(value: boolean) {
    this.booleanValue = value;
  }

  public static of(value: boolean): BooleanValue {
    return new BooleanValue(value);
  }

  getValue(): boolean {
    return this.booleanValue;
  }

  equals(other: Value<any>): boolean {
    return (
      BooleanValue.isBooleanValueType(other) &&
      other.booleanValue === this.booleanValue
    );
  }

  static isBooleanValueType(arg: any): arg is BooleanValueType {
    return typeof arg.booleanValue === "boolean";
  }
}

export type BooleanValueType = {
  booleanValue: boolean;
};
