import { BooleanValue } from "../../value/BooleanValue.js";
import { Expr2 } from "../Expr2.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";

export class AndExpr extends Expr2<BooleanValue, BooleanValue, BooleanValue> {
  constructor(left: Expr<BooleanValue>, right: Expr<BooleanValue>) {
    super(ExprKind.BOOLEAN_AND, left, right);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: BooleanValue,
    rightOperand: BooleanValue
  ): ExprEvalError | BooleanValue {
    return BooleanValue.of(leftOperand.getValue() && rightOperand.getValue());
  }

  toExprString(): string {
    return `${this.left.toExprString()} && ${this.right.toExprString()}`;
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }
}
