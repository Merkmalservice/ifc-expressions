import { Expr1 } from "../Expr1.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { StringValue } from "../../value/StringValue.js";

export class StringLiteralExpr extends Expr1<StringValue, StringValue> {
  constructor(value: StringValue) {
    super(value);
  }

  evaluate(ctx: IfcExpressionContext): StringValue {
    return this.value;
  }
}
