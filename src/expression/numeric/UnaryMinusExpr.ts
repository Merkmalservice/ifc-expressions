import { NumericValue } from "../../value/NumericValue.js";
import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class UnaryMinusExpr extends Expr1<NumericValue, NumericValue> {
  constructor(value: Expr<NumericValue>) {
    super(ExprKind.NUM_UNARY_MINUS, value);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: NumericValue
  ): ExprEvalError | NumericValue {
    return NumericValue.of(subExpressionResult.getValue().times(-1));
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendString("-").appendExpr(this.sub);
  }

  getType(): ExprType {
    return Type.NUMERIC;
  }
}
