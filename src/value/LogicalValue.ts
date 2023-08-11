import { Value } from "./Value.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";

export class LogicalValue implements Value<boolean | "UNKNOWN"> {
  public static readonly UNKNOWN = "UNKNOWN";
  private readonly logicalValue: boolean | "UNKNOWN";

  constructor(value: boolean | "UNKNOWN") {
    this.logicalValue = value;
  }

  public static of(value: boolean | "UNKNOWN"): LogicalValue {
    return new LogicalValue(value);
  }

  getValue(): boolean | "UNKNOWN" {
    return this.logicalValue;
  }

  equals(other: Value<any>): boolean {
    return (
      LogicalValue.isLogicalValueType(other) &&
      other.logicalValue === this.logicalValue
    );
  }

  getType(): ExprType {
    return Type.LOGICAL;
  }

  toString(): string {
    return this.logicalValue === LogicalValue.UNKNOWN
      ? "UNKNOWN"
      : this.logicalValue
      ? "TRUE"
      : "FALSE";
  }

  public static isLogicalValueType(arg: any): arg is LogicalValueType {
    return (
      (typeof arg.logicalValue !== "undefined" &&
        typeof arg.logicalValue === "boolean") ||
      arg.logicalValue === LogicalValue.UNKNOWN
    );
  }
}

export type LogicalValueType = {
  logicalValue: boolean | "UNKNOWN";
};
