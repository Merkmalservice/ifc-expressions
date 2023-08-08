import { ExprType } from "./ExprType.js";

export class TypeDisjunction implements ExprType {
  private readonly types: Array<ExprType>;

  constructor(...types: Array<ExprType>) {
    this.types = types.reduce((prev, t) => {
      if (!prev.some((p) => p.isSameTypeAs(t))) {
        prev.push(t);
      }
      return prev;
    }, []);
    Object.freeze(types);
  }

  getName(): string {
    return "{" + this.types.map((t) => t.getName()).join(" or ") + "}";
  }

  isSameTypeAs(other: ExprType): boolean {
    return (
      other instanceof TypeDisjunction &&
      this.types.every((t) => other.types.includes(t))
    );
  }

  getTypes(): Array<ExprType> {
    return this.types;
  }

  isSuperTypeOf(other: ExprType): boolean {
    if (other instanceof TypeDisjunction) {
      let moreGeneral = false;
      for (const to of other.types) {
        let matchFound = false;
        for (const t of this.types) {
          if (t.isSuperTypeOf(to)) {
            moreGeneral = true;
            matchFound = true;
            break;
          }
          if (t.isSameTypeAs(to)) {
            matchFound = true;
          }
        }
        if (!matchFound) {
          return false;
        }
      }
      return moreGeneral || this.types.length > other.types.length;
    }
    return this.types.some(
      (t) => t.isSameTypeAs(other) || t.isSuperTypeOf(other)
    );
  }

  isSubTypeOf(other: ExprType): boolean {
    if (other instanceof TypeDisjunction) {
      return other.isSuperTypeOf(this);
    }
    return this.types.every((t) => t.isSubTypeOf(other));
  }

  overlapsWith(other: ExprType): boolean {
    if (other instanceof TypeDisjunction) {
      return this.types.some((t) =>
        other.types.some((to) => t.overlapsWith(to))
      );
    }
    return this.types.some((t) => t.overlapsWith(other));
  }

  isAssignableFrom(other: ExprType) {
    return this.isSameTypeAs(other) || this.isSuperTypeOf(other);
  }
}
