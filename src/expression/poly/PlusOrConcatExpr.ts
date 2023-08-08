import { Expr2 } from "../Expr2.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { NumericValue } from "../../value/NumericValue.js";
import { ExprKind } from "../ExprKind.js";
import { StringValue } from "../../value/StringValue.js";
import { ExprEvalError, ExprEvalTypeErrorObj } from "../ExprEvalResult.js";
import { Type, Types } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";

export class PlusOrConcatExpr extends Expr2<
  NumericValue | StringValue,
  NumericValue | StringValue,
  NumericValue | StringValue
> {
  constructor(
    left: Expr<NumericValue | StringValue>,
    right: Expr<NumericValue | StringValue>
  ) {
    super(ExprKind.NUM_PLUS, left, right);
  }

  calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: NumericValue | StringValue,
    rightResult: NumericValue | StringValue
  ): NumericValue | StringValue | ExprEvalError {
    if (
      leftResult instanceof NumericValue &&
      rightResult instanceof NumericValue
    ) {
      return NumericValue.of(
        leftResult.getValue().plus(rightResult.getValue())
      );
    } else if (
      leftResult instanceof StringValue &&
      rightResult instanceof StringValue
    ) {
      return StringValue.of(leftResult.getValue() + rightResult.getValue());
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION,
      "Operator '+' requires the operands to be either both of type numeric or both of type string, but they are not.",
      [leftResult, rightResult]
    );
  }

  toExprString(): string {
    return `${this.left.toExprString()} + ${this.right.toExprString()}`;
  }

  getType(): ExprType {
    return Types.or(Type.NUMERIC, Type.STRING);
  }
}
