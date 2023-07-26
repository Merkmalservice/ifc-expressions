import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprBase } from "./ExprBase.js";
import { ExprKind } from "./ExprKind.js";
import {
  ExprEvalConsequentialError1Obj,
  ExprEvalConsequentialError2Obj,
  ExprEvalError,
  ExprEvalError2Obj,
  ExprEvalErrorUndefinedResult,
  ExprEvalResult,
  ExprEvalStatus,
  isExprEvalError,
  isExprEvalSuccess,
} from "./ExprEvalResult.js";
import { isNullish } from "../IfcExpressionUtils.js";
import { Expr } from "./Expr.js";

export abstract class Expr2<L, R, E> extends ExprBase<E> {
  readonly left: Expr<L>;
  readonly right: Expr<R>;

  protected constructor(exprKind: ExprKind, left: Expr<L>, right: Expr<R>) {
    super(exprKind);
    this.left = left;
    this.right = right;
  }

  protected abstract calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftOperand: L,
    rightOperand: R
  ): E | ExprEvalError;

  protected onBeforeRecursion(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ) {
    // override if subclass needs to do something before recursing
  }

  protected onAfterLeftRecursion(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: L
  ) {
    // override if subclass needs to do something with the left result, such as put it in the local context
  }

  public evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<E> {
    this.onBeforeRecursion(ctx, localCtx);
    const leftResult = this.left.evaluate(ctx, localCtx);
    if (isNullish(leftResult)) {
      return new ExprEvalErrorUndefinedResult(this.left.getKind());
    }
    if (isExprEvalError(leftResult)) {
      return this.makeErrorForLeftSubExprError(ctx, localCtx, leftResult);
    }
    this.onAfterLeftRecursion(ctx, localCtx, leftResult.result);
    const rightResult = this.right.evaluate(ctx, localCtx);
    if (isNullish(rightResult)) {
      return new ExprEvalErrorUndefinedResult(this.right.getKind());
    }
    if (isExprEvalSuccess(rightResult)) {
      try {
        const result = this.calculateResult(
          ctx,
          localCtx,
          leftResult.result,
          rightResult.result
        );
        return this.wrapInResultIfNecessary(result);
      } catch (error) {
        return this.handleError(error, leftResult, rightResult);
      }
    } else {
      return this.makeResultForRightSubExprError(
        ctx,
        localCtx,
        leftResult,
        rightResult
      );
    }
  }

  protected makeResultForRightSubExprError(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: ExprEvalResult<L>,
    rightResult: ExprEvalError
  ): ExprEvalResult<E> {
    return new ExprEvalConsequentialError2Obj(
      this.getKind(),
      leftResult,
      rightResult
    );
  }

  protected makeErrorForLeftSubExprError(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: ExprEvalError
  ): ExprEvalError {
    return new ExprEvalConsequentialError1Obj(
      this.getKind(),
      leftResult,
      "Cannot evaluate attribute reference"
    );
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
