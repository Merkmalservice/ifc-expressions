import {Expr2} from "../Expr2.js";
import {Expr} from "../Expr.js";
import {IfcExpressionContext} from "../../context/IfcExpressionContext.js";
import {StringValue} from "../../value/StringValue.js";
import {ExprKind} from "../ExprKind";

export class StringConcatExpr extends Expr2<
  StringValue,
  StringValue,
  StringValue
> {
  constructor(left: Expr<StringValue>, right: Expr<StringValue>) {
    super(ExprKind.STR_CONCAT, left, right);
  }

  calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    left: StringValue,
    right: StringValue
  ): StringValue {
    return StringValue.of(left.getValue() + right.getValue());
  }
}
