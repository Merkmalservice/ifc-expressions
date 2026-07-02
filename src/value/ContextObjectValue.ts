import { ExprType } from "../type/ExprType.js";
import { Value } from "./Value.js";

export class ContextObjectValue implements Value<Record<string, unknown>> {
  private readonly contextObjectValue: Record<string, unknown>;
  private readonly type: ExprType;

  constructor(value: Record<string, unknown>, type: ExprType) {
    this.contextObjectValue = value;
    this.type = type;
  }

  getValue(): Record<string, unknown> {
    return this.contextObjectValue;
  }

  equals(other: Value<any>): boolean {
    return this.contextObjectValue === other?.getValue();
  }

  toString(): string {
    return "[Context object]";
  }

  getType(): ExprType {
    return this.type;
  }
}
