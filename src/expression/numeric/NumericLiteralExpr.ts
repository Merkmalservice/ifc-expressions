import {IfcExpressionContext} from "../../context/IfcExpressionContext.js";
import {NumericValue} from "../../value/NumericValue.js";
import {ExprEvalError} from "../ExprEvalResult";
import {ExprKind} from "../ExprKind";
import {LiteralExpr} from "../LiteralExpr";

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
