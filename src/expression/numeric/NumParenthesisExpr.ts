import {Expr1} from "../Expr1.js";
import {Expr} from "../Expr.js";
import {IfcExpressionContext} from "../../context/IfcExpressionContext.js";
import {NumericValue} from "../../value/NumericValue.js";
import {ExprKind} from "../ExprKind";

export class NumParenthesisExpr extends Expr1<NumericValue, NumericValue> {
  constructor(expression: Expr<NumericValue>) {
    super(ExprKind.NUM_PARENTHESIS, expression);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionValue: NumericValue
  ): NumericValue {
    return subExpressionValue;
  }
}
