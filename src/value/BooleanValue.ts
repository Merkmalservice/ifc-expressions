import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";

export class BooleanValue implements Value<boolean>, Comparable<BooleanValue> {
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

  getType(): ExprType {
    return Type.BOOLEAN;
  }

  equals(other: Value<any>): boolean {
    return (
      BooleanValue.isBooleanValueType(other) &&
      other.booleanValue === this.booleanValue
    );
  }

  compareTo(other: BooleanValue): number {
    return this.booleanValue ? (other.booleanValue ? 0 : 1) : -1;
  }

  toString(): string {
    return this.booleanValue ? "TRUE" : "FALSE";
  }

  static isBooleanValueType(arg: any): arg is BooleanValueType {
    return typeof arg.booleanValue === "boolean";
  }
}

export type BooleanValueType = {
  booleanValue: boolean;
};
