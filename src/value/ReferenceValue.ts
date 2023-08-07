import { Value } from "./Value.js";

export class ReferenceValue implements Value<string> {
  private readonly referenceValue: string;

  constructor(value: string) {
    this.referenceValue = value;
  }

  public static of(value: string): ReferenceValue {
    return new ReferenceValue(value);
  }

  getValue(): string {
    return this.referenceValue;
  }

  equals(other: Value<any>): boolean {
    return (
      ReferenceValue.isReferenceValueType(other) &&
      other.referenceValue === this.referenceValue
    );
  }

  toString(): string {
    return this.referenceValue;
  }

  static isReferenceValueType(arg: any): arg is ReferenceValueType {
    return typeof arg.referenceValue === "string";
  }
}

export type ReferenceValueType = {
  referenceValue: string;
};
