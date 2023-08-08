import { ComparisonOp } from "./ComparisonOp.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { Comparable } from "../../value/Comparable.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";

export class GreaterThanOrEqual<
  T extends ExpressionValue & Comparable<T>
> extends ComparisonOp<T> {
  constructor(left: Expr<T>, right: Expr<T>) {
    super(ExprKind.CMP_GREATER_THAN_OR_EQUAL, left, right, (num) => num >= 0);
  }
}
