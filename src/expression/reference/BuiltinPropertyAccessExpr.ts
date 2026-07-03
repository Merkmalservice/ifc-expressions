import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr1 } from "../Expr1.js";
import { ExprKind } from "../ExprKind.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";
import { ContextObjectValue } from "../../value/ContextObjectValue.js";
import { ExprEvalErrorObj, ExprEvalStatus } from "../ExprEvalResult.js";
import {
  getBuiltinMemberValue,
  toExpressionValue,
} from "../../builtin/BuiltinRuntimeValueConverter.js";

export class BuiltinPropertyAccessExpr extends Expr1<
  ExpressionValue,
  ExpressionValue
> {
  private readonly memberName: string;
  private readonly targetName: string;
  private readonly type: ExprType;

  constructor(
    target: any,
    memberName: string,
    type: ExprType,
    targetName: string
  ) {
    super(ExprKind.REF_BUILTIN_MEMBER, target);
    this.memberName = memberName;
    this.targetName = targetName;
    this.type = type;
  }

  protected calculateResult(
    _ctx: IfcExpressionContext,
    _localCtx: Map<string, any>,
    subExpressionResult: ExpressionValue
  ): ExpressionValue | ExprEvalErrorObj {
    if (!(subExpressionResult instanceof ContextObjectValue)) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.TYPE_ERROR,
        `Builtin member access '.${this.memberName}' requires a context object target`,
        this.getTextSpan()
      );
    }
    const rawValue = getBuiltinMemberValue(
      subExpressionResult,
      this.memberName
    );
    if (rawValue === undefined || rawValue === null) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.NOT_FOUND,
        `No builtin member '${this.memberName}' found on '${this.targetName}'`,
        this.getTextSpan()
      );
    }
    return toExpressionValue(rawValue, this.type);
  }

  protected buildExprString(builder: ExprStringBuilder): void {
    builder.appendExpr(this.sub).appendString(`.${this.memberName}`);
  }

  getType(): ExprType {
    return this.type;
  }
}
