import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { DateFormatException } from "../error/value/DateFormatException.js";
import Decimal from "decimal.js";

export class IfcTimeValue
  implements Value<IfcTimeValue>, Comparable<IfcTimeValue>
{
  private readonly utcDateValue: Date;
  private readonly stringRepresentation;
  private readonly originalTimeZoneHours: number; // hours ahead of (+) or behind (-) UTC
  private readonly originalTimeZoneMinutes: number; // minutes ahead of (+) or behind (-) UTC
  private readonly secondFraction: Decimal;
  private static readonly regex =
    /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|(?<=23:59:)60)(\.\d+)?(Z|([+\-])(0[0-9]|1[0-2])(?::?([0-5][0-9]))?)?$/;

  constructor(value: string) {
    var parsed = IfcTimeValue.parseIfcDate(value);
    this.utcDateValue = parsed.utcDate;
    this.originalTimeZoneHours = parsed.originalTimeZoneHours;
    this.originalTimeZoneMinutes = parsed.originalTimeZoneMinutes;
    this.secondFraction = parsed.secondFraction;
    this.stringRepresentation = value;
  }

  public static parseIfcDate(value: string): {
    utcDate: Date;
    secondFraction: Decimal;
    originalTimeZoneHours?: number;
    originalTimeZoneMinutes?: number;
  } {
    let match = value.match(this.regex);
    if (isNullish(match)) {
      throw new DateFormatException("Not an IfcTime: " + value);
    }
    let [
      wholeString,
      hours,
      minutes,
      seconds,
      fractionSeconds,
      timeZoneWhole,
      timeZoneSign,
      timeZoneHours,
      timeZoneMinutes,
    ] = match;
    var utcDate = new Date(0);
    utcDate.setUTCHours(Number.parseInt(hours));
    utcDate.setUTCMinutes(Number.parseInt(minutes));
    utcDate.setUTCSeconds(Number.parseInt(seconds));
    var secondFraction = isNullish(fractionSeconds)
      ? new Decimal("0")
      : new Decimal("0" + fractionSeconds); //arbitrary precision fractions
    var originalZoneSign = isNullish(timeZoneSign)
      ? 0
      : timeZoneSign === "+"
      ? 1
      : -1;
    var originalTimeZoneHours =
      originalZoneSign *
      (isNullish(timeZoneHours) ? 0 : Number.parseInt(timeZoneHours));
    var originalTimeZoneMinutes =
      originalZoneSign *
      (isNullish(timeZoneMinutes) ? 0 : Number.parseInt(timeZoneMinutes));
    utcDate.setUTCHours(utcDate.getUTCHours() - originalTimeZoneHours);
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() - originalTimeZoneMinutes);
    return {
      utcDate,
      secondFraction,
      originalTimeZoneHours,
      originalTimeZoneMinutes,
    };
  }

  public static of(value: string): IfcTimeValue {
    return new IfcTimeValue(value);
  }

  getValue(): IfcTimeValue {
    return this;
  }

  getType(): ExprType {
    return Type.IFC_TIME;
  }

  static isIfcTimeValueType(arg: any): arg is IfcTimeValue {
    return (
      arg instanceof IfcTimeValue ||
      (!isNullish(arg.stringRepresentation) &&
        !isNullish(arg.stringRepresentation.match(IfcTimeValue.regex)))
    );
  }

  public static isValidStringRepresentation(str: string): boolean {
    return !isNullish(str.match(this.regex));
  }

  equals(other: Value<any>): boolean {
    return (
      IfcTimeValue.isIfcTimeValueType(other) &&
      this.utcDateValue.getTime() === other.utcDateValue.getTime() &&
      this.secondFraction.eq(other.secondFraction)
    );
  }

  toString(): string {
    return this.stringRepresentation;
  }

  compareTo(other: IfcTimeValue): number {
    var diff = this.utcDateValue.getTime() - other.utcDateValue.getTime();
    if (diff != 0) {
      return diff;
    }
    var diffD = this.secondFraction.minus(other.secondFraction);
    if (diffD.isZero()) {
      return 0;
    }
    if (diffD.lt(0)) {
      return -1;
    }
    return 1;
  }
}
