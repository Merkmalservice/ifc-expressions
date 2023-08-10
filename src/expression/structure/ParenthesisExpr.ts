import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprKind } from "../ExprKind.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class ParenthesisExpr extends Expr1<ExpressionValue, ExpressionValue> {
  constructor(expression: Expr<ExpressionValue>) {
    super(ExprKind.PARENTHESIS, expression);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionValue: ExpressionValue
  ): ExpressionValue {
    return subExpressionValue;
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendString("(").appendExpr(this.sub).appendString(")");
  }

  getType(): ExprType {
    return this.sub.getType();
  }
}
