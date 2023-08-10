import { Expr2 } from "../Expr2.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class PowerExpr extends Expr2<NumericValue, NumericValue, NumericValue> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_POWER, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: NumericValue,
    rightOperand: NumericValue
  ): ExprEvalError | NumericValue {
    return NumericValue.of(leftOperand.getValue().pow(rightOperand.getValue()));
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendExpr(this.left).appendString(" ^ ").appendExpr(this.right);
  }

  getType(): ExprType {
    return Type.NUMERIC;
  }
}
