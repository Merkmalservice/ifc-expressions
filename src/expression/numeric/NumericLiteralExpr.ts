import { Expr1 } from "../Expr1";
import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { NumericValue } from "../../value/NumericValue";

export class NumericLiteralExpr extends Expr1<NumericValue, NumericValue> {
  constructor(value: NumericValue) {
    super(value);
  }

  evaluate(ctx: IfcExpressionContext): NumericValue {
    return this.value;
  }
}
