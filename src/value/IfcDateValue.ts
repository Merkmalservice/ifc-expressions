import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { DateFormatException } from "../error/value/DateFormatException.js";

export class IfcDateValue
  implements Value<IfcDateValue>, Comparable<IfcDateValue>
{
  private readonly utcDateValue: Date;
  private readonly stringRepresentation;
  private readonly originalTimeZoneHours: number; // hours ahead of (+) or behind (-) UTC
  private readonly originalTimeZoneMinutes: number; // minutes ahead of (+) or behind (-) UTC
  private static readonly regex =
    /^([+\-]?(?:[1-9]\d*)?\d{4}(?<!0000))-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|([+\-])(0[0-9]|1[0-2])(?::?([0-5][0-9]))?)?$/;

  constructor(value: string) {
    var parsed = IfcDateValue.parseIfcDate(value);
    this.utcDateValue = parsed.utcDate;
    this.originalTimeZoneHours = parsed.originalTimeZoneHours;
    this.originalTimeZoneMinutes = parsed.originalTimeZoneMinutes;
    this.stringRepresentation = value;
  }

  public static parseIfcDate(value: string): {
    utcDate: Date;
    originalTimeZoneHours?: number;
    originalTimeZoneMinutes?: number;
  } {
    let match = value.match(this.regex);
    if (isNullish(match)) {
      throw new DateFormatException("Not an IfcDate: " + value);
    }
    let [
      wholeString,
      year,
      month,
      day,
      timeZoneWhole,
      timeZoneSign,
      timeZoneHours,
      timeZoneMinutes,
    ] = match;
    var utcDate = new Date(0);
    utcDate.setUTCFullYear(Number.parseInt(year));
    utcDate.setUTCMonth(Number.parseInt(month) - 1);
    utcDate.setUTCDate(Number.parseInt(day));
    var originalZoneSign = isNullish(timeZoneSign)
      ? 0
      : timeZoneSign === "+"
      ? -1
      : +1; //why? Beause +1 means 1 hour ahead of UTC, so we have to subtract 1 to get UTC
    var originalTimeZoneHours =
      originalZoneSign *
      (isNullish(timeZoneHours) ? 0 : Number.parseInt(timeZoneHours));
    var originalTimeZoneMinutes =
      originalZoneSign *
      (isNullish(timeZoneMinutes) ? 0 : Number.parseInt(timeZoneMinutes));
    utcDate.setUTCHours(utcDate.getUTCHours() + originalTimeZoneHours);
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() + originalTimeZoneMinutes);
    return { utcDate: utcDate, originalTimeZoneHours, originalTimeZoneMinutes };
  }

  public static of(value: string): IfcDateValue {
    return new IfcDateValue(value);
  }

  getValue(): IfcDateValue {
    return this;
  }

  getType(): ExprType {
    return Type.IFC_DATE;
  }

  static isIfcDateValueType(arg: any): arg is IfcDateValue {
    return (
      arg instanceof IfcDateValue ||
      (!isNullish(arg.stringRepresentation) &&
        !isNullish(arg.stringRepresentation.match(IfcDateValue.regex)))
    );
  }

  public static isValidStringRepresentation(str: string): boolean {
    return this.regex.test(str);
  }

  equals(other: Value<any>): boolean {
    return (
      IfcDateValue.isIfcDateValueType(other) &&
      this.utcDateValue.getTime() === other.utcDateValue.getTime()
    );
  }

  toString(): string {
    return this.stringRepresentation;
  }

  compareTo(other: IfcDateValue): number {
    return this.utcDateValue.getTime() - other.utcDateValue.getTime();
  }
}
