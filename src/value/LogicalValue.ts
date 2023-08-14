import { Value } from "./Value.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { BooleanValue } from "./BooleanValue";
import { Comparable } from "./Comparable";

export type Logical = boolean | "UNKNOWN";

export class LogicalValue implements Value<Logical>, Comparable<LogicalValue> {
  public static readonly UNKNOWN_VALUE = "UNKNOWN";
  private readonly logicalValue: Logical;
  private static readonly LOGICAL_VALUE_TRUE = new LogicalValue(true);
  private static readonly LOGICAL_VALUE_FALSE = new LogicalValue(false);
  private static readonly LOGICAL_VALUE_UNKNOWN = new LogicalValue(
    LogicalValue.UNKNOWN_VALUE
  );

  private constructor(value: Logical) {
    this.logicalValue = value;
  }

  public static true(): LogicalValue {
    return this.LOGICAL_VALUE_TRUE;
  }

  public static false(): LogicalValue {
    return this.LOGICAL_VALUE_FALSE;
  }

  public static unknown(): LogicalValue {
    return this.LOGICAL_VALUE_UNKNOWN;
  }

  public static of(value: Logical): LogicalValue {
    switch (value) {
      case this.UNKNOWN_VALUE:
        return this.LOGICAL_VALUE_UNKNOWN;
      case false:
        return this.LOGICAL_VALUE_FALSE;
      case true:
        return this.LOGICAL_VALUE_TRUE;
    }
    throw new Error(`Cannot get logical value of ${value}`);
  }

  getValue(): Logical {
    return this.logicalValue;
  }

  isTrue(): boolean {
    return this.logicalValue === true;
  }

  isFalse(): boolean {
    return this.logicalValue === false;
  }

  isUnknown(): boolean {
    return this.logicalValue === "UNKNOWN";
  }

  static isUnknown(val: any): boolean {
    return val === "UNKNOWN";
  }

  static isLogical(val: any): val is Logical {
    return typeof val === "boolean" || this.isUnknown(val);
  }

  and(other: LogicalValue | BooleanValue): LogicalValue {
    const otherValue = other.getValue();
    if (this.logicalValue === false || otherValue === false) {
      return LogicalValue.false();
    }
    if (this.isUnknown() || otherValue === LogicalValue.UNKNOWN_VALUE) {
      return LogicalValue.unknown();
    }
    return LogicalValue.true();
  }

  or(other: LogicalValue | BooleanValue): LogicalValue {
    const otherValue = other.getValue();
    if (this.logicalValue === true || otherValue === true) {
      return LogicalValue.true();
    }
    if (this.isUnknown() || otherValue === LogicalValue.UNKNOWN_VALUE) {
      return LogicalValue.unknown();
    }
    return LogicalValue.false();
  }

  xor(other: LogicalValue | BooleanValue): LogicalValue {
    const otherValue = other.getValue();
    if (this.isUnknown() || otherValue === LogicalValue.UNKNOWN_VALUE) {
      return LogicalValue.unknown();
    }
    return LogicalValue.of(this.logicalValue !== other.getValue());
  }

  implies(other: LogicalValue | BooleanValue): LogicalValue {
    const otherValue = other.getValue();
    if (otherValue === true) {
      return LogicalValue.true();
    }
    if (this.isUnknown()) {
      return LogicalValue.unknown();
    }
    if (this.isFalse()) {
      return LogicalValue.true();
    }
    return LogicalValue.of(otherValue);
  }

  public not(): LogicalValue {
    switch (this.logicalValue) {
      case LogicalValue.UNKNOWN_VALUE:
        return LogicalValue.LOGICAL_VALUE_UNKNOWN;
      case true:
        return LogicalValue.LOGICAL_VALUE_FALSE;
      case false:
        return LogicalValue.LOGICAL_VALUE_TRUE;
    }
    throw new Error(`Cannot invert logical value ${this.logicalValue}`);
  }

  equals(other: Value<any>): boolean {
    if (LogicalValue.isLogicalValueType(other)) {
      return this.logicalValue === other.logicalValue;
    } else if (BooleanValue.isBooleanValueType(other)) {
      return this.logicalValue === other.booleanValue;
    }
    return false;
  }

  getType(): ExprType {
    return Type.LOGICAL;
  }

  compareTo(other: LogicalValue): number {
    switch (this.logicalValue) {
      case true:
        return other.isTrue() ? 0 : 1;
      case false:
        return other.isTrue() ? -1 : other.logicalValue === false ? 0 : 1;
      case "UNKNOWN":
        return other.isUnknown() ? 0 : -1;
    }
    throw new Error(
      `Unexpected logical value comparison: ${this.logicalValue} vs ${other.logicalValue}`
    );
  }

  toString(): string {
    return this.logicalValue === LogicalValue.UNKNOWN_VALUE
      ? LogicalValue.UNKNOWN_VALUE
      : this.logicalValue
      ? "TRUE"
      : "FALSE";
  }

  public static isLogicalValueType(arg: any): arg is LogicalValue {
    return (
      (typeof arg.logicalValue !== "undefined" &&
        typeof arg.logicalValue === "boolean") ||
      arg.logicalValue === LogicalValue.UNKNOWN_VALUE
    );
  }
}
