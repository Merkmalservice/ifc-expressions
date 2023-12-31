import { ExpressionValue } from "../../value/ExpressionValue.js";
import { Expr2 } from "../Expr2.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { BooleanValue } from "../../value/BooleanValue.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class NotEqualsExpr extends Expr2<
  ExpressionValue,
  ExpressionValue,
  BooleanValue
> {
  constructor(left: Expr<ExpressionValue>, right: Expr<ExpressionValue>) {
    super(ExprKind.CMP_NOT_EQUALS, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: ExpressionValue,
    rightOperand: ExpressionValue
  ): ExprEvalError | BooleanValue {
    return BooleanValue.of(!leftOperand.equals(rightOperand));
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendExpr(this.left).appendString(" != ").appendExpr(this.right);
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }
}
