import { Decimal } from "decimal.js";
import { Value } from "./Value.js";
import {Comparable} from "./Comparable";

export class NumericValue implements Value<Decimal>, Comparable<NumericValue>{
  private readonly numericValue: Decimal;

  constructor(value: Decimal | string | number) {
    if (Decimal.isDecimal(value)) {
      this.numericValue = value;
    }
    this.numericValue = new Decimal(value);
  }

  public static of(value: Decimal | string | number): NumericValue {
    return new NumericValue(value);
  }

  getValue(): Decimal {
    return this.numericValue;
  }

  static isNumericValueType(arg: any): arg is NumericValueType {
    return Decimal.isDecimal(arg.numericValue);
  }

  equals(other: Value<any>): boolean {
    return (
      NumericValue.isNumericValueType(other) &&
      this.numericValue.eq(other.numericValue)
    );
  }

  toString(): string {
    return this.numericValue.toString();
  }

  compareTo(other: NumericValue): number {
    return this.numericValue.comparedTo(other.numericValue);
  }


}

export type NumericValueType = {
  numericValue: Decimal;
};
