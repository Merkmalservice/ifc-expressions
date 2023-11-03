import { BooleanValue } from "../../value/BooleanValue.js";
import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";
import { LogicalValue } from "../../value/LogicalValue";

export class NotExpr extends Expr1<
  BooleanValue | LogicalValue,
  BooleanValue | LogicalValue
> {
  constructor(sub: Expr<BooleanValue | LogicalValue>) {
    super(ExprKind.NOT, sub);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: BooleanValue | LogicalValue
  ): ExprEvalError | BooleanValue | LogicalValue {
    return subExpressionResult.not();
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendString("!").appendExpr(this.sub);
  }

  getType(): ExprType {
    return this.sub.getType();
  }
}
