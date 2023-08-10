import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind.js";
import {
  ExprEvalError,
  ExprEvalError1Obj,
  ExprEvalErrorUndefinedResult,
  ExprEvalResult,
  ExprEvalStatus,
  isExprEvalError,
} from "./ExprEvalResult.js";
import { ExprBase } from "./ExprBase.js";
import { Expr } from "./Expr.js";
import { isNullish } from "../util/IfcExpressionUtils.js";

export abstract class Expr1<V, E> extends ExprBase<E> {
  readonly sub: Expr<V>;

  protected constructor(exprKind: ExprKind, sub: Expr<V>) {
    super(exprKind);
    this.sub = sub;
  }

  getChildren(): Array<Expr<any>> {
    return [this.sub];
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
    return subExpressionResult;
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
    const subResult = this.sub.evaluate(ctx, localCtx);
    if (isNullish(subResult)) {
      return new ExprEvalError1Obj(
        this.getKind(),
        new ExprEvalErrorUndefinedResult(this.sub.getKind()),
        ExprEvalStatus.MISSING_OPERAND,
        undefined,
        this.getTextSpan()
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
      error,
      this.getTextSpan()
    );
  }
}
