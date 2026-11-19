import { LiteralExpr } from "../LiteralExpr.js";
import { BooleanValue } from "../../value/BooleanValue.js";
import { ExprKind } from "../ExprKind.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class BooleanLiteralExpr extends LiteralExpr<boolean, BooleanValue> {
  constructor(value: boolean) {
    super(ExprKind.BOOLEAN_LITERAL, value);
  }

  protected calculateResult(
    ctx: IfcExpressionContext
  ): ExprEvalError | BooleanValue {
    return BooleanValue.of(this.value);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendString(this.value === true ? "TRUE" : "FALSE");
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }
}
