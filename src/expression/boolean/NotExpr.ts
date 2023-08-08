import { BooleanValue } from "../../value/BooleanValue.js";
import { Expr1 } from "../Expr1.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";

export class NotExpr extends Expr1<BooleanValue, BooleanValue> {
  constructor(value: Expr<BooleanValue>) {
    super(ExprKind.BOOLEAN_NOT, value);
  }

  protected calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: BooleanValue
  ): ExprEvalError | BooleanValue {
    return BooleanValue.of(!subExpressionResult.getValue());
  }

  toExprString(): string {
    return `!${this.value}`;
  }

  getType(): ExprType {
    return Type.BOOLEAN;
  }
}
