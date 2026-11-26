import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { StringValue } from "../../value/StringValue.js";
import { LiteralExpr } from "../LiteralExpr.js";
import { ExprKind } from "../ExprKind.js";
import { ExprType } from "../../type/ExprType.js";
import { Type } from "../../type/Types.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class StringLiteralExpr extends LiteralExpr<StringValue, StringValue> {
  constructor(value: string) {
    super(ExprKind.STR_LITERAL, new StringValue(value));
  }

  calculateResult(ctx: IfcExpressionContext): StringValue {
    return this.value;
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder
      .appendString("'")
      .appendString(this.value.getValue())
      .appendString("'");
  }

  getType(): ExprType {
    return Type.STRING;
  }
}
