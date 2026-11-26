import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import { ExprKind } from "./ExprKind.js";
import { ExprEvalResult } from "./ExprEvalResult.js";
import { ExprType } from "../type/ExprType.js";
import { TextSpan } from "../util/TextSpan.js";
import { ExprStringBuilder } from "./ExprStringBuilder.js";

export interface Expr<T> {
  evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<T>;
  getKind(): ExprKind;

  toExprString(builder?: ExprStringBuilder): string;
  getChildren(): Array<Expr<any>>;
  setTextSpan(ctx: TextSpan);
  getTextSpan(): TextSpan | undefined;
  getType(): ExprType;
}
