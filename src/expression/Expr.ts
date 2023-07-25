import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind";
import { ExprEvalResult } from "./ExprEvalResult";

export interface Expr<T> {
  evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<T>;
  getKind(): ExprKind;
}
