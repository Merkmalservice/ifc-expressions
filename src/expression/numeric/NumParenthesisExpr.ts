import { Expr1 } from "../Expr1";
import { Expr } from "../Expr";
import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { NumericValue } from "../../value/NumericValue";

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
