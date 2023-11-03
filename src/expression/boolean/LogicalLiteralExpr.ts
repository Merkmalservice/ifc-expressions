import { LiteralExpr } from "../LiteralExpr.js";
import { ExprKind } from "../ExprKind.js";
import { ExprEvalError } from "../ExprEvalResult.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";
import { Logical, LogicalValue } from "../../value/LogicalValue";

export class LogicalLiteralExpr extends LiteralExpr<Logical, LogicalValue> {
  constructor(value: Logical) {
    super(ExprKind.LOGICAL_LITERAL, value);
  }

  protected calculateResult(
    ctx: IfcExpressionContext
  ): ExprEvalError | LogicalValue {
    return LogicalValue.of(this.value);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    switch (this.value) {
      case LogicalValue.UNKNOWN_VALUE:
        builder.appendString(LogicalValue.UNKNOWN_VALUE);
        break;
      case true:
        builder.appendString("TRUE");
        break;
      case false:
        builder.appendString("FALSE");
        break;
      default:
        throw new Error(
          "Cannot build exprString for logical value " + JSON.stringify(this)
        );
    }
  }

  getType(): ExprType {
    return Type.LOGICAL;
  }
}
