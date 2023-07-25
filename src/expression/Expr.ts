import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind.js";
import { ExprEvalResult } from "./ExprEvalResult.js";

export interface Expr<T> {
  evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<T>;
  getKind(): ExprKind;
}
