import { Value } from "./Value.js";

export class StringValue extends Value<string> {
  constructor(value: string) {
    super(value);
  }

  public static of(value: string): StringValue {
    return new StringValue(value);
  }
}
