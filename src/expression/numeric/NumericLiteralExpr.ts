import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { ExprKind } from "../ExprKind.js";
import { LiteralExpr } from "../LiteralExpr.js";

export class NumericLiteralExpr extends LiteralExpr<
  NumericValue,
  NumericValue
> {
  constructor(value: NumericValue) {
    super(ExprKind.NUM_LITERAL, value);
  }

  protected calculateResult(
    ctx: IfcExpressionContext
  ): NumericValue | ExprEvalError {
    return this.value;
  }
}
