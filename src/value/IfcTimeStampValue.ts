import { Decimal } from "decimal.js";
import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { isNullish } from "../IfcExpression.js";
import { DateFormatException } from "../error/value/DateFormatException.js";
import { IfcDateTimeValue } from "./IfcDateTimeValue.js";

export class IfcTimeStampValue
  implements Value<IfcTimeStampValue>, Comparable<IfcTimeStampValue>
{
  private readonly timeStamp: Decimal;

  constructor(value: string | number | Decimal) {
    if (typeof value === "string") {
      this.timeStamp = new Decimal(value);
    } else if (typeof value === "number") {
      this.timeStamp = new Decimal(value);
    } else {
      if (value.isInteger()) {
        this.timeStamp = value;
      } else {
        throw new DateFormatException(
          "Not a valid IfcTimeStamp: " + value.toString()
        );
      }
    }
    if (
      isNullish(this.timeStamp) ||
      this.timeStamp.isNaN() ||
      !this.timeStamp.isFinite()
    ) {
      throw new DateFormatException("Not a valid IfcTimeStamp: " + value);
    }
  }

  public static of(value: Decimal | string | number): IfcTimeStampValue {
    return new IfcTimeStampValue(value);
  }

  getValue(): IfcTimeStampValue {
    return this;
  }

  getType(): ExprType {
    return Type.IFC_TIME_STAMP;
  }

  static isIfcTimeStampValueType(arg: any): arg is IfcTimeStampValue {
    return (
      arg instanceof IfcTimeStampValue ||
      (!isNullish(arg.timeStamp) && arg.timeStamp instanceof Decimal)
    );
  }

  equals(other: Value<any>): boolean {
    return (
      IfcTimeStampValue.isIfcTimeStampValueType(other) &&
      this.timeStamp.eq(other.timeStamp)
    );
  }

  toString(): string {
    return this.timeStamp.toString();
  }

  compareTo(other: IfcTimeStampValue): number {
    return this.timeStamp.comparedTo(other.timeStamp);
  }

  getTimeStampSeconds(): Decimal {
    return this.timeStamp;
  }

  toIfcDateTimeValue(): IfcDateTimeValue {
    return IfcDateTimeValue.ofTimeStampSeconds(this.timeStamp);
  }
}
