import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprKind } from "../ExprKind.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprType } from "../../type/ExprType.js";

export class ParenthesisExpr extends Expr1<ExpressionValue, ExpressionValue> {
  constructor(expression: Expr<ExpressionValue>) {
    super(ExprKind.BOOLEAN_PARENTHESIS, expression);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionValue: ExpressionValue
  ): ExpressionValue {
    return subExpressionValue;
  }
  toExprString(): string {
    return `(${this.value.toExprString()})`;
  }

  getType(): ExprType {
    return this.value.getType();
  }
}
