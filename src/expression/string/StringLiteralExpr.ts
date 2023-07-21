import {IfcExpressionContext} from "../../context/IfcExpressionContext.js";
import {StringValue} from "../../value/StringValue.js";
import {LiteralExpr} from "../LiteralExpr";
import {ExprKind} from "../ExprKind";

export class StringLiteralExpr extends LiteralExpr<StringValue, StringValue> {
  constructor(value: StringValue) {
    super(ExprKind.STR_LITERAL, value);
  }

  calculateResult(ctx: IfcExpressionContext): StringValue {
    return this.value;
  }
}
