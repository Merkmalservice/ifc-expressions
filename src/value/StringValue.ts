import { Value } from "./Value.js";

export class StringValue implements Value<string> {
  private readonly stringValue: string;

  constructor(value: string) {
    this.stringValue = value;
  }

  public static of(value: string): StringValue {
    return new StringValue(value);
  }

  getValue(): string {
    return this.stringValue;
  }

  equals(other: Value<any>): boolean {
    return (
      StringValue.isStringValueType(other) &&
      other.stringValue === this.stringValue
    );
  }

  static isStringValueType(arg: any): arg is StringValueType {
    return typeof arg.stringValue === "string";
  }
}

export type StringValueType = {
  stringValue: string;
};
