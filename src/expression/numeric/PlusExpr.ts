import {Expr2} from "../Expr2.js";
import {Expr} from "../Expr.js";
import {IfcExpressionContext} from "../../context/IfcExpressionContext.js";
import {NumericValue} from "../../value/NumericValue.js";
import {ExprKind} from "../ExprKind";

export class PlusExpr extends Expr2<NumericValue, NumericValue, NumericValue> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_PLUS, left, right);
  }

  calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: NumericValue,
    rightResult: NumericValue
  ): NumericValue {
    return NumericValue.of(leftResult.getValue().plus(rightResult.getValue()));
  }
}
