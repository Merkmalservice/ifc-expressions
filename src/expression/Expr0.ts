import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind";
import { ExprBase } from "./ExprBase";
import {
  ExprEvalError,
  ExprEvalErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
} from "./ExprEvalResult";

export abstract class Expr0<E> extends ExprBase<E> {
  protected constructor(kind: ExprKind) {
    super(kind);
  }

  protected abstract doEvaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): E | ExprEvalError;

  public evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<E> {
    try {
      const result = this.doEvaluate(ctx, localCtx);
      return this.wrapInResultIfNecessary(result);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected handleError(error: any): ExprEvalError {
    return new ExprEvalErrorObj(this.getKind(), ExprEvalStatus.ERROR, error);
  }
}
