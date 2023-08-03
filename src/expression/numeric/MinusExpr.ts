import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind.js";
import { ExprEvalError } from "../ExprEvalResult.js";

export class MinusExpr extends Expr2<NumericValue, NumericValue, NumericValue> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_MINUS, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    left: NumericValue,
    right: NumericValue
  ): NumericValue | ExprEvalError {
    return NumericValue.of(left.getValue().minus(right.getValue()));
  }

  toExprString(): string {
    return `${this.left.toExprString()} - ${this.right.toExprString()}`;
  }

}
