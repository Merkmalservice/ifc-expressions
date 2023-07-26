import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind.js";
import {
  ExprEvalConsequentialError1Obj,
  ExprEvalError,
  ExprEvalError1Obj,
  ExprEvalErrorUndefinedResult,
  ExprEvalResult,
  ExprEvalStatus,
  isExprEvalError,
} from "./ExprEvalResult.js";
import { ExprBase } from "./ExprBase.js";
import { Expr } from "./Expr.js";
import { isNullish } from "../IfcExpressionUtils.js";

export abstract class Expr1<V, E> extends ExprBase<E> {
  readonly value: Expr<V>;

  protected constructor(exprKind: ExprKind, value: Expr<V>) {
    super(exprKind);
    this.value = value;
  }

  protected abstract calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: V
  ): E | ExprEvalError;

  /**
   * Override to generate a more specific error result.
   * @param ctx
   * @param localCtx
   * @param subExpressionResult
   * @protected
   */
  protected obtainResultForSubExpressionError(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: ExprEvalError
  ): ExprEvalResult<E> {
    return new ExprEvalConsequentialError1Obj(
      this.getKind(),
      subExpressionResult
    );
  }

  // calculate the final result
  private makeErrorOrCalculate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: ExprEvalResult<V>
  ): ExprEvalResult<E> {
    if (isExprEvalError(subExpressionResult)) {
      return this.obtainResultForSubExpressionError(
        ctx,
        localCtx,
        subExpressionResult
      );
    }
    return this.wrapInResultIfNecessary(
      this.calculateResult(ctx, localCtx, subExpressionResult.result)
    );
  }

  protected onBeforeRecusion(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): undefined | ExprEvalError {
    // do something before we calculate the subresult
    return undefined;
  }

  public evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<E> {
    const beforeRecursionError = this.onBeforeRecusion(ctx, localCtx);
    if (!isNullish(beforeRecursionError)) {
      return beforeRecursionError;
    }
    const subResult = this.value.evaluate(ctx, localCtx);
    if (isNullish(subResult)) {
      return new ExprEvalError1Obj(
        this.getKind(),
        new ExprEvalErrorUndefinedResult(this.value.getKind()),
        ExprEvalStatus.MISSING_OPERAND
      );
    }
    try {
      return this.makeErrorOrCalculate(ctx, localCtx, subResult);
    } catch (error) {
      return this.handleError(error, subResult);
    }
  }

  protected handleError(
    error: any,
    subResult: ExprEvalResult<V>
  ): ExprEvalError {
    return new ExprEvalError1Obj(
      this.getKind(),
      subResult,
      ExprEvalStatus.ERROR,
      error
    );
  }
}
