import { Decimal } from "decimal.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { ExprKind } from "../ExprKind.js";
import { LiteralExpr } from "../LiteralExpr.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class NumericLiteralExpr extends LiteralExpr<
  NumericValue,
  NumericValue
> {
  constructor(value: number | string | Decimal) {
    super(ExprKind.NUM_LITERAL, new NumericValue(value));
  }

  protected calculateResult(
    ctx: IfcExpressionContext
  ): NumericValue | ExprEvalError {
    return this.value;
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendString(this.value.getValue().toFixed());
  }

  getType(): ExprType {
    return Type.NUMERIC;
  }
}
