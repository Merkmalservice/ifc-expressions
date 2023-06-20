import { Value } from "./Value";
import Decimal from "decimal.js";

export class NumericValue extends Value<Decimal> {
  constructor(value: string | number | Decimal) {
    super(value instanceof Decimal ? value : new Decimal(value));
  }

  public static of(value: string | number | Decimal): NumericValue {
    return new NumericValue(value);
  }
}
