import { ExprType } from "./ExprType.js";
import { TupleType } from "./TupleType.js";

export class ArrayType implements ExprType {
  private readonly elementType: ExprType;

  constructor(elementType: ExprType) {
    this.elementType = elementType;
  }

  getElementType(): ExprType {
    return this.elementType;
  }

  getName(): string {
    return `[${this.elementType.getName()}]`;
  }

  isAssignableFrom(other: ExprType) {
    return this.isSameTypeAs(other) || this.isSuperTypeOf(other);
  }

  isSameTypeAs(other: ExprType): boolean {
    return (
      other instanceof ArrayType &&
      this.elementType.isSameTypeAs(other.elementType)
    );
  }

  isSubTypeOf(other: ExprType): boolean {
    if (other instanceof ArrayType) {
      return this.elementType.isSubTypeOf(other.elementType);
    } else if (other instanceof TupleType) {
      for (const t of other.getTypes()) {
        if (!this.elementType.isSubTypeOf(t)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  isSuperTypeOf(other: ExprType): boolean {
    if (other instanceof ArrayType) {
      return this.elementType.isSuperTypeOf(other.elementType);
    } else if (other instanceof TupleType) {
      for (const t of other.getTypes()) {
        let found = false;
        if (!this.elementType.isSuperTypeOf(t)) {
          found = true;
        }
        if (!found) return false;
      }
      return true;
    }
    return false;
  }

  overlapsWith(other: ExprType): boolean {
    if (other instanceof ArrayType) {
      return this.elementType.overlapsWith(other.elementType);
    } else if (other instanceof TupleType) {
      for (const t of other.getTypes()) {
        if (!this.elementType.overlapsWith(t)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
