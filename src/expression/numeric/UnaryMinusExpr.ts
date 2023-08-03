import { NumericValue } from "../../value/NumericValue.js";
import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { Decimal } from "decimal.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";

export class UnaryMinusExpr extends Expr1<NumericValue, NumericValue> {
  constructor(value: Expr<NumericValue>) {
    super(ExprKind.NUM_UNARY_MINUS, value);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: NumericValue
  ): ExprEvalError | NumericValue {
    return NumericValue.of(subExpressionResult.getValue().times(-1));
  }

  toExprString(): string {
    return `-${this.value.toExprString()}`;
  }

}
