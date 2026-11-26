import { ComparisonOp } from "./ComparisonOp.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { Comparable } from "../../value/Comparable.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class GreaterThan<
  T extends ExpressionValue & Comparable<T>
> extends ComparisonOp<T> {
  constructor(left: Expr<T>, right: Expr<T>) {
    super(ExprKind.CMP_GREATER_THAN, left, right, (num) => num > 0);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendExpr(this.left).appendString(" > ").appendExpr(this.right);
  }
}
