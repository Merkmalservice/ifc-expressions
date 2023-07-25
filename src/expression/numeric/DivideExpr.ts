import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind";
import {
  ExprEvalError,
  ExprEvalError2Obj,
  ExprEvalResult,
  ExprEvalStatus,
} from "../ExprEvalResult";

export class DivideExpr extends Expr2<
  NumericValue,
  NumericValue,
  NumericValue
> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_DIVIDE, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    left: NumericValue,
    right: NumericValue
  ): NumericValue | ExprEvalError {
    return NumericValue.of(left.getValue().dividedBy(right.getValue()));
  }

  protected handleError(
    error: any,
    leftResult: ExprEvalResult<NumericValue>,
    rightResult: ExprEvalResult<NumericValue>
  ): ExprEvalError {
    return new ExprEvalError2Obj(
      error,
      leftResult,
      rightResult,
      ExprEvalStatus.MATH_ERROR,
      error
    );
  }
}
