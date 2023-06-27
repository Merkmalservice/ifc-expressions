import { Expr1 } from "../Expr1.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";

export class NumericLiteralExpr extends Expr1<NumericValue, NumericValue> {
  constructor(value: NumericValue) {
    super(value);
  }

  evaluate(ctx: IfcExpressionContext): NumericValue {
    return this.value;
  }
}
