import {IfcExpressionContext} from "../context/IfcExpressionContext.js";
import {ExprBase} from "./ExprBase";
import {ExprKind} from "./ExprKind";
import {
    ExprEvalConsequentialError2Obj,
    ExprEvalError,
    ExprEvalError2Obj,
    ExprEvalErrorUndefinedResult,
    ExprEvalResult,
    ExprEvalStatus,
    isExprEvalSuccess,
} from "./ExprEvalResult";
import {isNullish} from "../IfcExpressionUtils";
import {Expr} from "./Expr";

export abstract class Expr2LeftBeforeRight<L, R, E> extends ExprBase<E> {
  readonly left: Expr<L>;
  readonly right: Expr<R>;

  protected constructor(exprKind: ExprKind, left: Expr<L>, right: Expr<R>) {
    super(exprKind);
    this.left = left;
    this.right = right;
  }

  protected abstract doEvaluate(
    ctx: IfcExpressionContext,
    leftOperand: L,
    rightOperand: R
  ): E | ExprEvalError;

  protected abstract handleLeftResult(leftResult: ExprEvalResult<L>);

  public evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<E> {
    const leftResult = this.left.evaluate(ctx, localCtx);
    if (isNullish(leftResult)) {
      return new ExprEvalErrorUndefinedResult(this.left.getKind());
    }
    this.handleLeftResult(leftResult);
    const rightResult = this.right.evaluate(ctx, localCtx);
    if (isNullish(leftResult) || isNullish(rightResult)) {
      return new ExprEvalError2Obj(
        this.getKind(),
        isNullish(leftResult)
          ? new ExprEvalErrorUndefinedResult(this.left.getKind())
          : leftResult,
        isNullish(rightResult)
          ? new ExprEvalErrorUndefinedResult(this.right.getKind())
          : rightResult,
        ExprEvalStatus.MISSING_OPERAND
      );
    }
    if (isExprEvalSuccess(leftResult) && isExprEvalSuccess(rightResult)) {
      try {
        const result = this.doEvaluate(
          ctx,
          leftResult.result,
          rightResult.result
        );
        return this.wrapInResultIfNecessary(result);
      } catch (error) {
        return this.handleError(error, leftResult, rightResult);
      }
    } else {
      return new ExprEvalConsequentialError2Obj(
        this.getKind(),
        leftResult,
        rightResult
      );
    }
  }

  protected handleError(
    error: any,
    leftResult: ExprEvalResult<L>,
    rightResult: ExprEvalResult<R>
  ): ExprEvalError {
    return new ExprEvalError2Obj(
      this.getKind(),
      leftResult,
      rightResult,
      ExprEvalStatus.ERROR,
      error
    );
  }
}
