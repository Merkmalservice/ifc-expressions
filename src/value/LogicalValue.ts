import { Value } from "./Value.js";

export class LogicalValue implements Value<boolean | "UNKNOWN"> {
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

  toString(): string {
    return this.logicalValue === "UNKNOWN" ? "UNKNOWN" : (this.logicalValue ? "TRUE" : "FALSE");
  }

  public static isLogicalValueType(arg: any): arg is LogicalValueType {
    return (
      (typeof arg.logicalValue !== "undefined" &&
        typeof arg.logicalValue === "boolean") ||
      arg.logicalValue === "UNKNOWN"
    );
  }
}

export type LogicalValueType = {
  logicalValue: boolean | "UNKNOWN";
};
