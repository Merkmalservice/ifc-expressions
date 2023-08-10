import { Expr } from "./Expr.js";
import { IfcExpressionContext } from "../context/IfcExpressionContext.js";
import {
  ExprEvalConsequentialError1Obj,
  ExprEvalError,
  ExprEvalResult,
  ExprEvalSuccessObj,
  isExprEvalError,
} from "./ExprEvalResult.js";
import { ExprKind } from "./ExprKind.js";
import { ExprType } from "../type/ExprType.js";
import { TextSpan } from "../util/TextSpan.js";
import { isNullish } from "../util/IfcExpressionUtils.js";
import { ExprStringBuilder } from "./ExprStringBuilder.js";

export abstract class ExprBase<T> implements Expr<T> {
  private readonly exprKind: ExprKind;
  private textSpan?: TextSpan;

  protected constructor(exprKind: ExprKind) {
    this.exprKind = exprKind;
  }

  setTextSpan(ctx: TextSpan) {
    this.textSpan = ctx;
  }

  getTextSpan(): TextSpan | undefined {
    return this.textSpan;
  }

  abstract getChildren(): Array<Expr<any>>;

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
      if (!this.hasTextSpan(result)) {
        return new ExprEvalConsequentialError1Obj(
          this.getKind(),
          result,
          undefined,
          this.getTextSpan()
        );
      }
      return result;
    }
    return new ExprEvalSuccessObj(result);
  }

  private hasTextSpan(error: any): boolean {
    if (!isNullish(error["textSpan"])) {
      return true;
    }
    const cause = error["cause"];
    if (!isNullish(cause)) {
      return this.hasTextSpan(cause);
    }
    const leftCause = error["leftCause"];
    const rightCause = error["rightCause"];
    return (
      (isNullish(leftCause) ? false : this.hasTextSpan(leftCause)) ||
      (isNullish(rightCause) ? false : this.hasTextSpan(rightCause))
    );
  }

  toExprString(builder: ExprStringBuilder = new ExprStringBuilder(0)): string {
    this.buildExprString(builder);
    if (isNullish(this.getTextSpan())) {
      this.setTextSpan(
        TextSpan.of(1, builder.startPos + 1, 1, builder.endPos + 1)
      );
    }
    return builder.build();
  }

  protected abstract buildExprString(builder: ExprStringBuilder): void;

  abstract getType(): ExprType;
}
