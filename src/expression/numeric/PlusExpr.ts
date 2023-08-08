import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";

export class PlusExpr extends Expr2<NumericValue, NumericValue, NumericValue> {
  constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
    super(ExprKind.NUM_PLUS, left, right);
  }

  calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: NumericValue,
    rightResult: NumericValue
  ): NumericValue {
    return NumericValue.of(leftResult.getValue().plus(rightResult.getValue()));
  }

  toExprString(): string {
    return `${this.left.toExprString()} + ${this.right.toExprString()}`;
  }

  getType(): ExprType {
    return Type.NUMERIC;
  }
}
