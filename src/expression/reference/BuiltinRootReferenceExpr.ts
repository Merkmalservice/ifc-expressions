import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr0 } from "../Expr0.js";
import { ExprKind } from "../ExprKind.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";
import { ExprEvalErrorObj, ExprEvalStatus } from "../ExprEvalResult.js";
import { toExpressionValue } from "../../builtin/BuiltinRuntimeValueConverter.js";

export class BuiltinRootReferenceExpr extends Expr0<ExpressionValue> {
  private readonly name: string;
  private readonly type: ExprType;

  constructor(name: string, type: ExprType) {
    super(ExprKind.REF_BUILTIN_ROOT);
    this.name = name.replace(/^\$/, "");
    this.type = type;
  }

  doEvaluate(ctx: IfcExpressionContext): ExpressionValue | ExprEvalErrorObj {
    const value = ctx.resolveBuiltinVariable(this.name);
    if (value === undefined || value === null) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.NOT_FOUND,
        `No builtin variable found with name '$${this.name}'`,
        this.getTextSpan()
      );
    }
    return toExpressionValue(value, this.type);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder.appendString(`$${this.name}`);
  }

  getType(): ExprType {
    return this.type;
  }
}
