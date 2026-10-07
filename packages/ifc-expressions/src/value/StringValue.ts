import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { Type } from "../type/Types.js";
import { ExprType } from "../type/ExprType.js";

export class StringValue implements Value<string>, Comparable<StringValue> {
  private readonly stringValue: string;
  private static collator = new Intl.Collator();

  constructor(value: string) {
    this.stringValue = value;
  }

  public static of(value: string): StringValue {
    return new StringValue(value);
  }

  getValue(): string {
    return this.stringValue;
  }

  toString(): string {
    return this.stringValue;
  }

  equals(other: Value<any>): boolean {
    return (
      StringValue.isStringValueType(other) &&
      other.stringValue === this.stringValue
    );
  }

  compareTo(other: StringValue): number {
    return StringValue.collator.compare(this.stringValue, other.stringValue);
  }

  getType(): ExprType {
    return Type.STRING;
  }

  static isStringValueType(arg: any): arg is StringValueType {
    return typeof arg.stringValue === "string";
  }
}

export type StringValueType = {
  stringValue: string;
};
