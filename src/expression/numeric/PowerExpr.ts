import { Expr2 } from "../Expr2.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";

export class PowerExpr extends Expr2<NumericValue, NumericValue, NumericValue> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_POWER, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: NumericValue,
    rightOperand: NumericValue
  ): ExprEvalError | NumericValue {
    return NumericValue.of(leftOperand.getValue().pow(rightOperand.getValue()));
  }

  toExprString(): string {
    return `${this.left.toExprString()} ^ ${this.right.toExprString()}`;
  }

}
