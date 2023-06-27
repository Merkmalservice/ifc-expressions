import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { StringValue } from "../../value/StringValue.js";

export class StringConcatExpr extends Expr2<
  Expr<StringValue>,
  Expr<StringValue>,
  StringValue
> {
  constructor(left: Expr<StringValue>, right: Expr<StringValue>) {
    super(left, right);
  }

  evaluate(ctx: IfcExpressionContext): StringValue {
    return StringValue.of(
      this.left.evaluate(ctx).getValue() + this.right.evaluate(ctx).getValue()
    );
  }
}
