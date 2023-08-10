import { Expr } from "./Expr.js";
import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import {
  ExprEvalErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
} from "./ExprEvalResult.js";
import { ExprKind } from "./ExprKind.js";
import { ExprType } from "../type/ExprType.js";
import { isNullish } from "../util/IfcExpressionUtils.js";

export class ExprFacade<T> {
  private readonly delegate: Expr<T>;

  constructor(delegate: Expr<T>) {
    this.delegate = delegate;
  }

  evaluate(ctx: IfcExpressionContext): ExprEvalResult<T> {
    try {
      let span = this.delegate.getTextSpan();
      if (isNullish(span)) {
        this.delegate.toExprString();
      }
      return this.delegate.evaluate(ctx, new Map<string, any>());
    } catch (e) {
      return new ExprEvalErrorObj(
        this.delegate.getKind(),
        ExprEvalStatus.ERROR,
        "Unexpected error occurred during expression evaluation, this is a bug - please report." +
          (isNullish(e.message)
            ? ""
            : "\nMessage of caught error is: " + e.message) +
          "\nStacktrace:\n" +
          e.stack,
        this.delegate.getTextSpan()
      );
    }
  }

  getKind(): ExprKind {
    return this.delegate.getKind();
  }

  getType(): ExprType {
    return this.delegate.getType();
  }

  toExprString(): string {
    return this.delegate.toExprString();
  }
}
