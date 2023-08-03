import { BooleanValue } from "../../value/BooleanValue";
import { Expr2 } from "../Expr2";
import { ExprKind } from "../ExprKind";
import { Expr } from "../Expr";
import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { ExprEvalError } from "../ExprEvalResult";

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

}
