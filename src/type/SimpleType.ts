import { isNullish } from "../IfcExpressionUtils.js";
import { Type } from "./Types.js";
import { ExprType } from "./ExprType.js";
import { TypeDisjunction } from "./TypeDisjunction.js";

export class SimpleType implements ExprType {
  private readonly superType: SimpleType;
  private readonly name: string;

  constructor(name: string, superType: SimpleType = Type.ANY) {
    this.superType = superType;
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  isSameTypeAs(other: ExprType): boolean {
    return this === other || other.getName() === this.getName();
  }

  isSuperTypeOf(other: ExprType): boolean {
    return other.isSubTypeOf(this);
  }

  isSubTypeOf(other: ExprType): boolean {
    if (other instanceof TypeDisjunction) {
      return other.isSuperTypeOf(this);
    }
    if (isNullish(this.superType)) {
      return false;
    }
    if (this.superType.isSameTypeAs(other)) {
      return true;
    }
    if (this.superType.isSameTypeAs(Type.ANY)) {
      return false;
    }
    return this.superType.isSubTypeOf(other);
  }

  overlapsWith(other: ExprType): boolean {
    return (
      this.isSameTypeAs(other) ||
      this.isSuperTypeOf(other) ||
      this.isSubTypeOf(other)
    );
  }

  isAssignableFrom(other: ExprType) {
    return this.isSameTypeAs(other) || this.isSuperTypeOf(other);
  }
}
