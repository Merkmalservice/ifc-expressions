import { ExpressionValue } from "../../value/ExpressionValue.js";
import { Expr2 } from "../Expr2.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Comparable } from "../../value/Comparable.js";
import { BooleanValue } from "../../value/BooleanValue.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";

export class ComparisonOp<
  T extends ExpressionValue & Comparable<T>
> extends Expr2<T, T, BooleanValue> {
  private readonly comparisonFunction: (number) => boolean;

  constructor(
    exprKind: ExprKind,
    left: Expr<T>,
    right: Expr<T>,
    cmp: (number) => boolean
  ) {
    super(exprKind, left, right);
    this.comparisonFunction = cmp;
  }

  toExprString(): string {
    return `${this.left.toExprString()} > ${this.right.toExprString}`;
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: T,
    rightOperand: T
  ): ExprEvalError | BooleanValue {
    return BooleanValue.of(
      this.comparisonFunction(leftOperand.compareTo(rightOperand))
    );
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }
}
