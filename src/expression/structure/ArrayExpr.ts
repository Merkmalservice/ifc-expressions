import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import {
  ExprEvalConsequentialError1Obj,
  ExprEvalError,
  isExprEvalError,
} from "../ExprEvalResult.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { Expr0 } from "../Expr0.js";
import { ArrayValue } from "../../value/ArrayValue.js";
import { LiteralValue } from "../../value/LiteralValue.js";

export class ArrayExpr extends Expr0<ArrayValue> {
  private elements: Array<Expr<LiteralValue>>;

  constructor(elements: Array<Expr<LiteralValue>>) {
    super(ExprKind.ARRAY);
    this.elements = elements;
  }

  protected doEvaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalError | ArrayValue {
    const evaluatedResult = [];
    for (let i = 0; i < this.elements.length; i++) {
      const evalResult = this.elements[i].evaluate(ctx, localCtx);
      if (isExprEvalError(evalResult)) {
        return new ExprEvalConsequentialError1Obj(
          this.getKind(),
          evalResult,
          `Error evaluating array element at 0-based position ${i}`
        );
      }
      evaluatedResult.push(evalResult.result);
    }
    return new ArrayValue(evaluatedResult);
  }
}
