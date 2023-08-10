import { BooleanValue } from "../../value/BooleanValue.js";
import { Expr2 } from "../Expr2.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class XorExpr extends Expr2<BooleanValue, BooleanValue, BooleanValue> {
  constructor(left: Expr<BooleanValue>, right: Expr<BooleanValue>) {
    super(ExprKind.BOOLEAN_XOR, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: BooleanValue,
    rightOperand: BooleanValue
  ): ExprEvalError | BooleanValue {
    const left = leftOperand.getValue();
    const right = rightOperand.getValue();
    return BooleanValue.of(left ? !right : right);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendExpr(this.left).appendString(" ><").appendExpr(this.right);
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }
}
