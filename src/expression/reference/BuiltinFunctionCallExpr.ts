import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprBase } from "../ExprBase.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprEvalErrorObj, ExprEvalResult, ExprEvalStatus, isExprEvalError } from "../ExprEvalResult.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";
import { BuiltinObjectValue } from "../../value/BuiltinObjectValue.js";
import { getBuiltinMemberValue, toExpressionValue, unwrapExpressionValue } from "../../builtin/BuiltinRuntimeValueConverter.js";

export class BuiltinFunctionCallExpr extends ExprBase<ExpressionValue> {
  private readonly target: Expr<ExpressionValue>;
  private readonly name: string;
  private readonly args: Array<Expr<ExpressionValue>>;
  private readonly targetName: string;
  private readonly type: ExprType;

  constructor(
    target: Expr<ExpressionValue>,
    name: string,
    args: Array<Expr<ExpressionValue>>,
    type: ExprType,
    targetName: string
  ) {
    super(ExprKind.REF_BUILTIN_FUNCTION);
    this.target = target;
    this.name = name;
    this.args = args;
    this.type = type;
    this.targetName = targetName;
  }

  getChildren(): Array<Expr<any>> {
    return [this.target, ...this.args];
  }

  evaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalResult<ExpressionValue> {
    const targetResult = this.target.evaluate(ctx, localCtx);
    if (isExprEvalError(targetResult)) {
      return targetResult;
    }
    if (!(targetResult.result instanceof BuiltinObjectValue)) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.TYPE_ERROR,
        `Builtin function '${this.name}' requires a builtin object target`,
        this.getTextSpan()
      );
    }

    const evaluatedArgs: Array<ExpressionValue> = [];
    for (const arg of this.args) {
      const argResult = arg.evaluate(ctx, localCtx);
      if (isExprEvalError(argResult)) {
        return argResult;
      }
      evaluatedArgs.push(argResult.result);
    }

    const fn = getBuiltinMemberValue(targetResult.result, this.name);
    if (typeof fn !== "function") {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.NOT_FOUND,
        `No builtin function '${this.name}' found on '${this.targetName}'`,
        this.getTextSpan()
      );
    }

    const rawResult = fn.apply(
      targetResult.result.getValue(),
      evaluatedArgs.map((arg) => unwrapExpressionValue(arg))
    );
    if (rawResult === undefined || rawResult === null) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.NOT_FOUND,
        `Builtin function '${this.name}' on '${this.targetName}' returned no value`,
        this.getTextSpan()
      );
    }
    return this.wrapInResultIfNecessary(toExpressionValue(rawResult, this.type));
  }

  protected buildExprString(builder: ExprStringBuilder): void {
    builder
      .appendExpr(this.target)
      .appendString(`.${this.name}(`)
      .appendExprArray(this.args)
      .appendString(")");
  }

  getType(): ExprType {
    return this.type;
  }
}
