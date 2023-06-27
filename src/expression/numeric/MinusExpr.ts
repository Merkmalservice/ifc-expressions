import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";

export class MinusExpr extends Expr2<
  Expr<NumericValue>,
  Expr<NumericValue>,
  NumericValue
> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(left, right);
  }

  evaluate(ctx: IfcExpressionContext): NumericValue {
    return NumericValue.of(
      this.left
        .evaluate(ctx)
        .getValue()
        .minus(this.right.evaluate(ctx).getValue())
    );
  }
}
