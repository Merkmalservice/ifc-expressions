import { Value } from "./Value.js";

export class LogicalValue extends Value<boolean | "UNKNOWN"> {
  constructor(value: boolean | "UNKNOWN") {
    super(value);
  }

  public static of(value: boolean | "UNKNOWN"): LogicalValue {
    return new LogicalValue(value);
  }
}
