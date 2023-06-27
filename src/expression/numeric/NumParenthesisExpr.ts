import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";

export class NumParenthesisExpr extends Expr1<
  Expr<NumericValue>,
  NumericValue
> {
  constructor(expression: Expr<NumericValue>) {
    super(expression);
  }

  evaluate(ctx: IfcExpressionContext): NumericValue {
    return this.value.evaluate(ctx);
  }
}
