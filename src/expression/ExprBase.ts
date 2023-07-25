import { Expr } from "./Expr";
import { IfcExpressionContext } from "../context/IfcExpressionContext";
import {
  ExprEvalError,
  ExprEvalResult,
  ExprEvalSuccessObj,
  isExprEvalError,
} from "./ExprEvalResult";
import { ExprKind } from "./ExprKind";

export abstract class ExprBase<T> implements Expr<T> {
  private readonly exprKind: ExprKind;

  constructor(exprKind: ExprKind) {
    this.exprKind = exprKind;
  }

  abstract evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<T>;

  getKind(): ExprKind {
    return this.exprKind;
  }

  protected wrapInResultIfNecessary(
    result: T | ExprEvalError
  ): ExprEvalResult<T> {
    if (isExprEvalError(result)) {
      return result;
    }
    return new ExprEvalSuccessObj(result);
  }
}
