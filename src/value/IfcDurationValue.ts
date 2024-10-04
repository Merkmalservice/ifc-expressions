import { Value } from "./Value.js";
import { Comparable } from "./Comparable.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { DateFormatException } from "../error/value/DateFormatException.js";
import Decimal from "decimal.js";

export class IfcDurationValue
  implements Value<IfcDurationValue>, Comparable<IfcDurationValue>
{
  private readonly stringRepresentation;
  private static readonly MINUTE = new Decimal(60);
  private static readonly HOUR = IfcDurationValue.MINUTE.mul(60);
  private static readonly DAY = IfcDurationValue.HOUR.mul(24);
  private static readonly WEEK = IfcDurationValue.DAY.mul(7);
  private static readonly YEAR = new Decimal(31557600);
  private static readonly MONTH = IfcDurationValue.YEAR.div(12);
  private readonly years: Decimal;
  private readonly months: Decimal;
  private readonly weeks: Decimal;
  private readonly days: Decimal;
  private readonly hours: Decimal;
  private readonly minutes: Decimal;
  private readonly seconds: Decimal;
  private readonly fractionAsSeconds: Decimal;
  private readonly totalSeconds: Decimal;

  private static readonly regex =
    /^P(?!$)(?:(\d+(?:\.\d+(?=Y$))?)Y)?(?:(\d+(?:\.\d+(?=M$))?)M)?(?:(\d+(?:\.\d+(?=W$))?)W)?(?:(\d+(?:\.\d+(?=D$))?)D)?(?:T(?!$)(?:(\d+(?:\.\d+(?=H$))?)H)?(?:(\d+(?:\.\d+(?=M$))?)M)?(?:(\d+(?:\.\d+(?=S$))?)S)?)?$/;

  constructor(value: string) {
    const {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      fractionAsSeconds,
      totalSeconds,
    } = IfcDurationValue.parseIfcDuration(value);
    this.years = years;
    this.months = months;
    this.weeks = weeks;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.totalSeconds = totalSeconds;
    this.fractionAsSeconds = fractionAsSeconds;
    this.stringRepresentation = value;
  }

  public static parseIfcDuration(value: string): {
    years: Decimal;
    months: Decimal;
    weeks: Decimal;
    days: Decimal;
    hours: Decimal;
    minutes: Decimal;
    seconds: Decimal;
    fractionAsSeconds: Decimal;
    totalSeconds: Decimal;
  } {
    Decimal.set({ defaults: true });
    let match = value.match(this.regex);
    if (isNullish(match)) {
      throw new DateFormatException("Not an IfcDateTime: " + value);
    }
    let [
      wholeString,
      yearsVal,
      monthsVal,
      weeksVal,
      daysVal,
      hoursVal,
      minutesVal,
      secondsVal,
    ] = match;
    var years = new Decimal(isNullish(yearsVal) ? "0" : yearsVal);
    var months = new Decimal(isNullish(monthsVal) ? "0" : monthsVal);
    var weeks = new Decimal(isNullish(weeksVal) ? "0" : weeksVal);
    var days = new Decimal(isNullish(daysVal) ? "0" : daysVal);
    var hours = new Decimal(isNullish(hoursVal) ? "0" : hoursVal);
    var minutes = new Decimal(isNullish(minutesVal) ? "0" : minutesVal);
    var seconds = new Decimal(isNullish(secondsVal) ? "0" : secondsVal);
    var fractionAsSeconds = IfcDurationValue.getFractionAsSeconds(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds
    );
    var totalSeconds = years
      .mul(IfcDurationValue.YEAR)
      .plus(months.mul(IfcDurationValue.MONTH))
      .plus(weeks.mul(IfcDurationValue.WEEK))
      .plus(days.mul(IfcDurationValue.DAY))
      .plus(hours.mul(IfcDurationValue.HOUR))
      .plus(minutes.mul(IfcDurationValue.MINUTE))
      .plus(seconds);
    return {
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      fractionAsSeconds,
      totalSeconds,
    };
  }

  private static getFractionAsSeconds(
    years: Decimal,
    months: Decimal,
    weeks: Decimal,
    days: Decimal,
    hours: Decimal,
    minutes: Decimal,
    seconds: Decimal
  ) {
    if (!seconds.isZero() && !seconds.isInteger()) {
      return seconds.minus(seconds.divToInt(1));
    }
    if (!minutes.isZero() && !minutes.isInteger()) {
      return minutes.minus(minutes.divToInt(1)).times(IfcDurationValue.MINUTE);
    }
    if (!hours.isZero() && !hours.isInteger()) {
      return hours.minus(hours.divToInt(1)).times(IfcDurationValue.HOUR);
    }
    if (!days.isZero() && !days.isInteger()) {
      return days.minus(days.divToInt(1)).times(IfcDurationValue.DAY);
    }
    if (!weeks.isZero() && !weeks.isInteger()) {
      return weeks.minus(weeks.divToInt(1)).times(IfcDurationValue.WEEK);
    }
    if (!months.isZero() && !months.isInteger()) {
      return months.minus(months.divToInt(1)).times(IfcDurationValue.MONTH);
    }
    if (!years.isZero() && !years.isInteger()) {
      return years.minus(years.divToInt(1)).times(IfcDurationValue.YEAR);
    }
    return new Decimal(0);
  }

  public static of(value: string): IfcDurationValue {
    return new IfcDurationValue(value);
  }

  getValue(): IfcDurationValue {
    return this;
  }

  getType(): ExprType {
    return Type.IFC_DURATION;
  }

  static isIfcDurationValueType(arg: any): arg is IfcDurationValue {
    return (
      arg instanceof IfcDurationValue ||
      (!isNullish(arg.stringRepresentation) &&
        !isNullish(arg.stringRepresentation.match(IfcDurationValue.regex)) &&
        !isNullish(arg.totalSeconds))
    );
  }

  public static isValidStringRepresentation(str: string): boolean {
    return !isNullish(str.match(this.regex));
  }

  equals(other: Value<any>): boolean {
    return (
      IfcDurationValue.isIfcDurationValueType(other) &&
      this.totalSeconds.eq(other.totalSeconds)
    );
  }

  toString(): string {
    return this.stringRepresentation;
  }

  compareTo(other: IfcDurationValue): number {
    var diff = this.totalSeconds.minus(other.totalSeconds);
    return Decimal.sign(diff);
  }

  getYears() {
    return this.years;
  }
  getMonths() {
    return this.months;
  }
  getWeeks() {
    return this.weeks;
  }
  getDays() {
    return this.days;
  }
  getHours() {
    return this.hours;
  }
  getMinutes() {
    return this.minutes;
  }
  getSeconds() {
    return this.seconds;
  }
  getTotalSeconds() {
    return this.totalSeconds;
  }
  getFractionAsSeconds() {
    return this.fractionAsSeconds;
  }
}
