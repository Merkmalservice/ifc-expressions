import { BinaryBooleanOpExpr } from "./BinaryBooleanOpExpr.js";
import { ExprKind } from "../ExprKind.js";
import { BooleanValue } from "../../value/BooleanValue.js";
import { LogicalValue } from "../../value/LogicalValue.js";
import { Expr } from "../Expr.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class OrExpr extends BinaryBooleanOpExpr {
  constructor(
    left: Expr<BooleanValue | LogicalValue>,
    right: Expr<BooleanValue | LogicalValue>
  ) {
    super(ExprKind.OR, "or", left, right);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendExpr(this.left).appendString(" || ").appendExpr(this.right);
  }
}
