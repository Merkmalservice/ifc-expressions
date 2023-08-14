import { BinaryBooleanOpExpr } from "./BinaryBooleanOpExpr";
import { ExprKind } from "../ExprKind";
import { BooleanValue } from "../../value/BooleanValue";
import { LogicalValue } from "../../value/LogicalValue";
import { Expr } from "../Expr";
import { ExprStringBuilder } from "../ExprStringBuilder";

export class AndExpr extends BinaryBooleanOpExpr {
  constructor(
    left: Expr<BooleanValue | LogicalValue>,
    right: Expr<BooleanValue | LogicalValue>
  ) {
    super(ExprKind.AND, "and", left, right);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendExpr(this.left).appendString(" && ").appendExpr(this.right);
  }
}
