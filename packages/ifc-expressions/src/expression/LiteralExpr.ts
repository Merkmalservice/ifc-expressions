import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind.js";
import {
  ExprEvalError,
  ExprEvalErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
} from "./ExprEvalResult.js";
import { ExprBase } from "./ExprBase.js";
import { Expr } from "./Expr.js";

export abstract class LiteralExpr<V, E> extends ExprBase<E> {
  readonly value: V;

  protected constructor(exprKind: ExprKind, value: V) {
    super(exprKind);
    this.value = value;
  }

  getChildren(): Array<Expr<any>> {
    return [];
  }

  protected abstract calculateResult(
    ctx: IfcExpressionContext
  ): E | ExprEvalError;

  public evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<E> {
    try {
      const result = this.calculateResult(ctx);
      return this.wrapInResultIfNecessary(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected handleError(error: any): ExprEvalError {
    return new ExprEvalErrorObj(
      this.getKind(),
      ExprEvalStatus.ERROR,
      error,
      this.getTextSpan()
    );
  }
}
