import { ExprType } from "../type/ExprType.js";
import { Value } from "./Value.js";

export class BuiltinObjectValue implements Value<Record<string, unknown>> {
  private readonly builtinObjectValue: Record<string, unknown>;
  private readonly type: ExprType;

  constructor(value: Record<string, unknown>, type: ExprType) {
    this.builtinObjectValue = value;
    this.type = type;
  }

  getValue(): Record<string, unknown> {
    return this.builtinObjectValue;
  }

  equals(other: Value<any>): boolean {
    return this.builtinObjectValue === other?.getValue();
  }

  toString(): string {
    return "[Client builtin object]";
  }

  getType(): ExprType {
    return this.type;
  }
}
