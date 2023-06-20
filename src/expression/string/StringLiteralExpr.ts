import { Expr1 } from "../Expr1";
import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { StringValue } from "../../context/value/StringValue";

export class StringLiteralExpr extends Expr1<StringValue, StringValue> {
  constructor(value: StringValue) {
    super(value);
  }

  evaluate(ctx: IfcExpressionContext): StringValue {
    return this.value;
  }
}
