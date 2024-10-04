import { BooleanValue } from "../../value/BooleanValue.js";
import { Expr2 } from "../Expr2.js";
import { ExprKind } from "../ExprKind.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { Type, Types } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { LogicalValue } from "../../value/LogicalValue.js";

export abstract class BinaryBooleanOpExpr extends Expr2<
  BooleanValue | LogicalValue,
  BooleanValue | LogicalValue,
  BooleanValue | LogicalValue
> {
  private readonly method: string;

  constructor(
    kind: ExprKind,
    method: string,
    left: Expr<BooleanValue | LogicalValue>,
    right: Expr<BooleanValue | LogicalValue>
  ) {
    super(kind, left, right);
    this.method = method;
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: BooleanValue | LogicalValue,
    rightOperand: BooleanValue | LogicalValue
  ): ExprEvalError | BooleanValue | LogicalValue {
    return leftOperand[this.method].call(leftOperand, rightOperand);
  }

  getType(): ExprType {
    if (
      Types.isLogical(this.left.getType()) ||
      Types.isLogical(this.right.getType())
    ) {
      return Type.LOGICAL;
    }
    return Type.BOOLEAN;
  }
}
