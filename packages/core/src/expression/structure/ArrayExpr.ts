import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError, isExprEvalError } from "../ExprEvalResult.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { Expr0 } from "../Expr0.js";
import { ArrayValue } from "../../value/ArrayValue.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprType } from "../../type/ExprType.js";
import { Types } from "../../type/Types.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class ArrayExpr extends Expr0<ArrayValue> {
  private elements: Array<Expr<ExpressionValue>>;

  constructor(elements: Array<Expr<ExpressionValue>>) {
    super(ExprKind.ARRAY);
    this.elements = elements;
  }

  getChildren(): Array<Expr<any>> {
    return [...this.elements];
  }

  protected doEvaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalError | ArrayValue {
    const evaluatedResult = [];
    for (let i = 0; i < this.elements.length; i++) {
      const evalResult = this.elements[i].evaluate(ctx, localCtx);
      if (isExprEvalError(evalResult)) {
        return evalResult;
      }
      evaluatedResult.push(evalResult.result);
    }
    return new ArrayValue(evaluatedResult);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder
      .appendString("[")
      .appendExprArray(this.elements, ",")
      .appendString("]");
  }

  getType(): ExprType {
    return Types.tuple(...this.elements.map((e) => e.getType()));
  }
}
