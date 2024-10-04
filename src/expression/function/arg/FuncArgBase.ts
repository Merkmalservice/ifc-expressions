import { FuncArg } from "../FuncArg.js";
import {
  ExprEvalError,
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ExprKind, isNullish } from "../../../IfcExpression.js";

export abstract class FuncArgBase<T> extends FuncArg<T> {
  protected constructor(required: boolean, name: string, defaultValue?: T) {
    super(required, name, defaultValue);
  }

  transformValue(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalResult<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    if (isExprEvalSuccess(invocationValue)) {
      return this.errorIfNullish(
        this.transformForTypeCheck(callingExpr, invocationValue),
        callingExpr
      );
    }
    return this.errorIfNullish(
      this.transformForError(callingExpr, invocationValue),
      callingExpr
    );
  }

  private errorIfNullish(
    result: ExprEvalResult<ExpressionValue>,
    callingExpr: FunctionExpr
  ) {
    if (isNullish(result)) {
      return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION_ARGUMENTS,
        `Cannot obtain value of argument ${this.name}`,
        callingExpr.getTextSpan()
      );
    }
    return result;
  }

  /**
   * Override to type-check the successfully evaluated invocationValue.
   * @protected
   */
  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    return invocationValue;
  }

  /**
   * Override to transform the error result obtained from evaluating the invocation value.
   * @param invocationValue
   * @protected
   */
  protected transformForError(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalError
  ): ExprEvalResult<ExpressionValue> {
    return invocationValue;
  }
}
