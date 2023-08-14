import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { LogicalValue } from "./LogicalValue";

export class BooleanValue implements Value<boolean>, Comparable<BooleanValue> {
  private readonly booleanValue: boolean;

  private static readonly TRUE_VALUE = new BooleanValue(true);
  private static readonly FALSE_VALUE = new BooleanValue(false);

  private constructor(value: boolean) {
    this.booleanValue = value;
  }

  public static of(value: boolean): BooleanValue {
    if (value === true) {
      return this.TRUE_VALUE;
    } else if (value === false) {
      return this.FALSE_VALUE;
    }
    throw new Error(`Cannot get boolean value of ${value}`);
  }

  getValue(): boolean {
    return this.booleanValue;
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }

  static true() {
    return BooleanValue.of(true);
  }

  static false() {
    return BooleanValue.of(false);
  }

  static isBoolean(val: any): val is boolean {
    return typeof val === "boolean";
  }

  isTrue() {
    return this.booleanValue === true;
  }

  isFalse() {
    return this.booleanValue === false;
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

  and<T extends LogicalValue | BooleanValue>(other: T): T {
    if (other instanceof LogicalValue) {
      return other.and(this) as T;
    }
    return BooleanValue.of(this.booleanValue && other.booleanValue) as T;
  }

  or<T extends LogicalValue | BooleanValue>(other: T): T {
    if (other instanceof LogicalValue) {
      return other.or(this) as T;
    }
    return BooleanValue.of(this.booleanValue || other.booleanValue) as T;
  }

  xor<T extends LogicalValue | BooleanValue>(other: T): T {
    if (other instanceof LogicalValue) {
      return other.xor(this) as T;
    }
    return BooleanValue.of(this.booleanValue != other.booleanValue) as T;
  }

  implies<T extends LogicalValue | BooleanValue>(other: T): T {
    if (other instanceof LogicalValue) {
      if (other.isUnknown()) {
        return (
          this.isFalse() ? LogicalValue.true() : LogicalValue.unknown()
        ) as T;
      } else {
        return LogicalValue.of(!this.booleanValue || other.getValue()) as T;
      }
    }
    return BooleanValue.of(!this.booleanValue || other.booleanValue) as T;
  }

  not(): BooleanValue {
    return this.isTrue() ? BooleanValue.false() : BooleanValue.true();
  }

  equals(other: Value<any>): boolean {
    if (LogicalValue.isLogicalValueType(other)) {
      return this.booleanValue === other.getValue();
    } else if (BooleanValue.isBooleanValueType(other)) {
      return this.booleanValue === other.booleanValue;
    }
    return false;
  }
}

export type BooleanValueType = {
  booleanValue: boolean;
};
