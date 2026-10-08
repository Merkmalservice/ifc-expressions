import { ExprType } from "../type/ExprType.js";
import { Value } from "./Value.js";
import { ContextObjectType } from "../type/ContextObjectType.js";
import { ContextObjectOperator } from "../type/ContextObjectTypeFactory.js";

export class ContextObjectValue<T = Record<string, unknown>>
  implements Value<T>
{
  private readonly contextObjectValue: T;
  private readonly type: ExprType;

  constructor(value: T, type: ExprType) {
    this.contextObjectValue = value;
    this.type = type;
  }

  getValue(): T {
    return this.contextObjectValue;
  }

  equals(other: Value<any>): boolean {
    if (
      this.type instanceof ContextObjectType &&
      this.type.getFactory() !== undefined
    ) {
      if (!(other instanceof ContextObjectValue)) {
        return false;
      }
      const otherType = other.getType();
      if (
        !(otherType instanceof ContextObjectType) ||
        otherType.getFactory() !== this.type.getFactory()
      ) {
        return false;
      }
      const equals = this.type
        .getFactory()
        .getBinaryOperator(ContextObjectOperator.EQUALS);
      if (!equals) {
        throw new Error(
          `Context-object type '${this.type.getName()}' does not support operator '=='`
        );
      }
      return equals(this.contextObjectValue, other.getValue());
    }
    return this.contextObjectValue === other?.getValue();
  }

  toString(): string {
    return "[Context object]";
  }

  getType(): ExprType {
    return this.type;
  }
}
