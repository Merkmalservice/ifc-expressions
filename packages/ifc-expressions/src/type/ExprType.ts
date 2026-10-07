export interface ExprType {
  getName(): string;
  isSuperTypeOf(other: ExprType): boolean;
  isSameTypeAs(other: ExprType): boolean;
  isSubTypeOf(other: ExprType): boolean;
  overlapsWith(other: ExprType): boolean;
  isAssignableFrom(other: ExprType);
}
