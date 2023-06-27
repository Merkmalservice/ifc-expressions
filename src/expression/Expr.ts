import { IfcExpressionContext } from "../context/IfcExpressionContext.js";

export interface Expr<T> {
  evaluate(ctx: IfcExpressionContext): T;
}
