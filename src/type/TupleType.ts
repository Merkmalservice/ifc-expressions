import { ExprType } from "./ExprType.js";
import { ArrayType } from "./ArrayType.js";
import { TypeDisjunction } from "./TypeDisjunction.js";

export class TupleType implements ExprType {
  private readonly types: Array<ExprType>;

  constructor(...types: Array<ExprType>) {
    this.types = types;
    Object.freeze(types);
  }

  getTypes(): Array<ExprType> {
    return this.types;
  }

  toArrayType(): ArrayType {
    return new ArrayType(new TypeDisjunction(...this.getTypes()));
  }

  getName(): string {
    return "<" + this.types.map((t) => t.getName()).join(", ") + ">";
  }

  isAssignableFrom(other: ExprType) {
    if (other instanceof TupleType) {
      return this.compareToOtherTuple(other, (t, to) => t.isAssignableFrom(to));
    }
    return false;
  }

  isSameTypeAs(other: ExprType): boolean {
    if (other instanceof TupleType) {
      return this.compareToOtherTuple(other, (t, to) => t.isSameTypeAs(to));
    }
    return false;
  }

  isSubTypeOf(other: ExprType): boolean {
    if (other instanceof TupleType) {
      return this.compareToOtherTuple(other, (t, to) => t.isSubTypeOf(to));
    } else if (other instanceof ArrayType) {
      for (const t of this.types) {
        if (
          !(
            t.isSubTypeOf(other.getElementType()) ||
            t.isSameTypeAs(other.getElementType())
          )
        ) {
          return false;
        }
      }
      return true;
    } else if (other instanceof TypeDisjunction) {
      return other.isSuperTypeOf(this);
    }
    return false;
  }

  private compareToOtherTuple(
    other: TupleType,
    cmp: (t: ExprType, to: ExprType) => boolean
  ) {
    const n = this.types.length;
    if (other.types.length !== n) {
      return false;
    }
    for (let i = 0; i < n; i++) {
      const t = this.types[i];
      const to = other.types[i];
      if (!cmp(t, to)) {
        return false;
      }
    }
    return true;
  }

  isSuperTypeOf(other: ExprType): boolean {
    if (other instanceof TupleType) {
      return this.compareToOtherTuple(other, (t, to) => t.isSuperTypeOf(to));
    } else if (other instanceof ArrayType) {
      for (const t of this.types) {
        if (!t.isSuperTypeOf(other.getElementType())) {
          return false;
        }
      }
      return true;
    } else if (other instanceof TypeDisjunction) {
      return other.isSubTypeOf(this);
    }
    return false;
  }

  overlapsWith(other: ExprType): boolean {
    if (other instanceof TupleType) {
      return this.compareToOtherTuple(other, (t, to) => t.overlapsWith(to));
    } else if (other instanceof ArrayType) {
      for (const t of this.types) {
        if (!t.overlapsWith(other.getElementType())) {
          return false;
        }
      }
      return true;
    } else if (other instanceof TypeDisjunction) {
      return other.overlapsWith(this);
    }
    return false;
  }
}
