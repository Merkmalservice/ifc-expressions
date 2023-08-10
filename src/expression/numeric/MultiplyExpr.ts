import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class MultiplyExpr extends Expr2<
  NumericValue,
  NumericValue,
  NumericValue
> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_MULTIPLY, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    left: NumericValue,
    right: NumericValue
  ): NumericValue | ExprEvalError {
    return NumericValue.of(left.getValue().mul(right.getValue()));
  }

  protected buildExprString(builder: ExprStringBuilder): void {
    builder.appendExpr(this.left).appendString(" * ").appendExpr(this.right);
  }

  getType(): ExprType {
    return Type.NUMERIC;
  }
}
