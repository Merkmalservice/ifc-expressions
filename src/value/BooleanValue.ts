import { Value } from "./Value.js";

export class BooleanValue extends Value<boolean> {
  constructor(value: boolean) {
    super(value);
  }

  public static of(value: boolean): BooleanValue {
    return new BooleanValue(value);
  }
}
