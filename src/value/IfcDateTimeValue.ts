import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { DateFormatException } from "../error/value/DateFormatException.js";
import Decimal from "decimal.js";
import { IfcDateValue } from "./IfcDateValue.js";
import { IfcTimeValue } from "./IfcTimeValue.js";
import { IfcTimeStampValue } from "./IfcTimeStampValue.js";
import { IfcDurationValue } from "./IfcDurationValue.js";

export class IfcDateTimeValue
  implements Value<IfcDateTimeValue>, Comparable<IfcDateTimeValue>
{
  private readonly utcDate: Date;
  private readonly stringRepresentation;
  private readonly originalTimeZoneHours: number; // hours ahead of (+) or behind (-) UTC
  private readonly originalTimeZoneMinutes: number; // minutes ahead of (+) or behind (-) UTC
  private readonly isLocal: boolean;
  private readonly secondFraction: Decimal;
  private static readonly regex =
    /^([+\-]?(?:[1-9]\d*)?\d{4}(?<!0000))-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|(?<=23:59:)60)(\.\d+)?(Z|([+\-])(0[0-9]|1[0-2])(?::?([0-5][0-9]))?)?$/;

  constructor(
    value: string | number | Decimal | IfcDateTimeValue | ParsedIfcDateTimeValue
  ) {
    if (typeof value === "string") {
      var parsed = IfcDateTimeValue.parseIfcDate(value);
      this.utcDate = parsed.utcDate;
      this.originalTimeZoneHours = parsed.originalTimeZoneHours;
      this.originalTimeZoneMinutes = parsed.originalTimeZoneMinutes;
      this.secondFraction = parsed.secondFraction;
      this.isLocal = parsed.isLocal;
    } else if (typeof value === "number" || value instanceof Decimal) {
      let timeStampSeconds = value;
      if (value instanceof Decimal) {
        timeStampSeconds = (value as Decimal).round().toNumber();
      }
      this.utcDate = new Date(timeStampSeconds as number);
      this.originalTimeZoneHours = 0;
      this.originalTimeZoneMinutes = 0;
      this.secondFraction = new Decimal(0);
      this.isLocal = false;
    } else if (value instanceof IfcDateTimeValue) {
      this.utcDate = value.utcDate;
      this.originalTimeZoneMinutes = value.originalTimeZoneMinutes;
      this.originalTimeZoneHours = value.originalTimeZoneHours;
      this.secondFraction = value.secondFraction;
      this.isLocal = value.isLocal;
    } else if (isParsedIfcDateTimeValue(value)) {
      this.utcDate = value.utcDate;
      this.secondFraction = value.secondFraction;
      this.originalTimeZoneHours = value.originalTimeZoneHours;
      this.originalTimeZoneMinutes = value.originalTimeZoneMinutes;
      this.isLocal = value.isLocal;
    }
    this.stringRepresentation = this.toCanonicalString();
  }

  public static parseIfcDate(value: string): ParsedIfcDateTimeValue {
    Decimal.set({ defaults: true });
    let match = value.match(this.regex);
    if (isNullish(match)) {
      throw new DateFormatException("Not an IfcDateTime: " + value);
    }
    let [
      wholeString,
      year,
      month,
      day,
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
    utcDate.setUTCFullYear(Number.parseInt(year));
    utcDate.setUTCMonth(Number.parseInt(month) - 1);
    utcDate.setUTCDate(Number.parseInt(day));
    utcDate.setUTCHours(Number.parseInt(hours));
    utcDate.setUTCMinutes(Number.parseInt(minutes));
    utcDate.setUTCSeconds(Number.parseInt(seconds));
    const secondFraction = isNullish(fractionSeconds)
      ? new Decimal("0")
      : new Decimal("0" + fractionSeconds); //arbitrary precision fractions (to the precision of Decimal.precision)
    const originalZoneSign = isNullish(timeZoneSign)
      ? 0
      : timeZoneSign === "+"
      ? 1
      : -1;
    const originalTimeZoneHours =
      originalZoneSign *
      (isNullish(timeZoneHours) ? 0 : Number.parseInt(timeZoneHours));
    const originalTimeZoneMinutes =
      originalZoneSign *
      (isNullish(timeZoneMinutes) ? 0 : Number.parseInt(timeZoneMinutes));
    const isLocal = isNullish(timeZoneWhole);
    utcDate.setUTCHours(utcDate.getUTCHours() - originalTimeZoneHours);
    utcDate.setUTCMinutes(utcDate.getUTCMinutes() - originalTimeZoneMinutes);
    return {
      utcDate,
      secondFraction,
      originalTimeZoneHours,
      originalTimeZoneMinutes,
      isLocal,
    };
  }

  public static of(value: string): IfcDateTimeValue {
    return new IfcDateTimeValue(value);
  }

  private getTimeAsString() {
    const fraction = isNullish(this.secondFraction)
      ? ""
      : this.secondFraction.isZero()
      ? ""
      : this.secondFraction.toString().substring(1);
    return `${this.pad00(
      this.utcDate.getUTCHours() + this.originalTimeZoneHours
    )}:${this.pad00(
      this.utcDate.getUTCMinutes() + this.originalTimeZoneMinutes
    )}:${this.pad00(this.utcDate.getUTCSeconds())}${fraction}`;
  }

  private pad00(num: number): string {
    return ("" + num).padStart(2, "0");
  }

  private getDateAsString() {
    return `${this.utcDate.getUTCFullYear()}-${this.pad00(
      this.utcDate.getUTCMonth() + 1
    )}-${this.pad00(this.utcDate.getUTCDate())}`;
  }

  getTimeZoneAsString(): String {
    if (this.isLocal) {
      return "";
    }
    if (
      this.originalTimeZoneMinutes === 0 &&
      this.originalTimeZoneHours === 0
    ) {
      return "Z";
    }
    const sign =
      this.originalTimeZoneHours >= 0 && this.originalTimeZoneMinutes >= 0
        ? "+"
        : "-";
    return `${sign}${this.pad00(
      Math.abs(this.originalTimeZoneHours)
    )}:${this.pad00(Math.abs(this.originalTimeZoneMinutes))}`;
  }

  private getTimeStampSeconds(): Decimal {
    const offset = this.isLocal ? new Date().getTimezoneOffset() * 60 : 0;
    return new Decimal(this.utcDate.getTime()).divToInt(1000).minus(offset);
  }

  private getTime(): Decimal {
    const offset = this.isLocal ? new Date().getTimezoneOffset() * 60 : 0;
    return new Decimal(this.utcDate.getTime())
      .minus(offset)
      .plus(this.secondFraction);
  }

  getValue(): IfcDateTimeValue {
    return this;
  }

  getType(): ExprType {
    return Type.IFC_DATE_TIME;
  }

  static isIfcDateTimeValueType(arg: any): arg is IfcDateTimeValue {
    return (
      arg instanceof IfcDateTimeValue ||
      (!isNullish(arg.stringRepresentation) &&
        !isNullish(arg.stringRepresentation.match(IfcDateTimeValue.regex)))
    );
  }

  public static isValidStringRepresentation(str: string): boolean {
    return this.regex.test(str);
  }

  equals(other: Value<any>): boolean {
    return (
      IfcDateTimeValue.isIfcDateTimeValueType(other) &&
      this.getTime().eq(other.getTime())
    );
  }

  private toCanonicalString(): string {
    return (
      this.getDateAsString() +
      "T" +
      this.getTimeAsString() +
      this.getTimeZoneAsString()
    );
  }

  toString(): string {
    return this.stringRepresentation;
  }

  compareTo(other: IfcDateTimeValue): number {
    return Decimal.sign(this.getTime().minus(other.getTime()));
  }

  static ofTimeStampSeconds(timeStampSeconds: Decimal | number) {
    var timeStampMillis = timeStampSeconds;
    if (timeStampSeconds instanceof Decimal) {
      timeStampMillis = timeStampSeconds.round().toNumber();
    }
    timeStampMillis = (timeStampMillis as number) * 1000;
    return new IfcDateTimeValue(timeStampMillis);
  }

  toIfcDateValue(): IfcDateValue {
    return IfcDateValue.of(this.getDateAsString() + this.getTimeZoneAsString());
  }

  toIfcTimeValue(): IfcTimeValue {
    return IfcTimeValue.of(this.getTimeAsString() + this.getTimeZoneAsString());
  }

  toIfcTimeStampValue(): IfcTimeStampValue {
    return IfcTimeStampValue.of(this.getTimeStampSeconds());
  }

  addDuration(duration: IfcDurationValue): IfcDateTimeValue {
    const resultDate = new Date(this.utcDate.getTime());
    const accumulatedFractions = this.secondFraction.add(
      duration.getFractionAsSeconds()
    );
    const newSecondFraction = accumulatedFractions.minus(
      accumulatedFractions.divToInt(1)
    );
    resultDate.setUTCSeconds(
      resultDate.getUTCSeconds() + accumulatedFractions.divToInt(1).toNumber()
    );
    resultDate.setUTCSeconds(
      resultDate.getUTCSeconds() + duration.getSeconds().divToInt(1).toNumber()
    );
    resultDate.setUTCMinutes(
      resultDate.getUTCMinutes() + duration.getMinutes().divToInt(1).toNumber()
    );
    resultDate.setUTCHours(
      resultDate.getUTCHours() + duration.getHours().divToInt(1).toNumber()
    );
    resultDate.setUTCDate(
      resultDate.getUTCDate() + duration.getDays().divToInt(1).toNumber()
    );
    resultDate.setUTCDate(
      resultDate.getUTCDate() +
        duration.getWeeks().divToInt(1).times(7).toNumber()
    );
    resultDate.setUTCMonth(
      resultDate.getUTCMonth() + duration.getMonths().divToInt(1).toNumber()
    );
    resultDate.setUTCFullYear(
      resultDate.getUTCFullYear() + duration.getYears().divToInt(1).toNumber()
    );
    return new IfcDateTimeValue({
      utcDate: resultDate,
      secondFraction: newSecondFraction,
      originalTimeZoneHours: this.originalTimeZoneHours,
      originalTimeZoneMinutes: this.originalTimeZoneMinutes,
      isLocal: this.isLocal,
    });
  }
}

export type ParsedIfcDateTimeValue = {
  utcDate: Date;
  secondFraction: Decimal;
  originalTimeZoneHours?: number;
  originalTimeZoneMinutes?: number;
  isLocal: boolean;
};

export function isParsedIfcDateTimeValue(
  arg: any
): arg is ParsedIfcDateTimeValue {
  return (
    !isNullish(arg.utcDate) &&
    !isNullish(arg.secondFraction) &&
    !isNullish(arg.originalTimeZoneHours) &&
    !isNullish(arg.originalTimeZoneMinutes) &&
    !isNullish(arg.isLocal)
  );
}
