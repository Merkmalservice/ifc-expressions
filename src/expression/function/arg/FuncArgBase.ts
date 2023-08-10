import { FuncArg } from "../FuncArg.js";
import {
  ExprEvalError,
  ExprEvalResult,
  ExprEvalSuccess,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { FunctionExpr } from "../FunctionExpr.js";

export abstract class FuncArgBase<T> extends FuncArg<T> {
  protected constructor(required: boolean, name: string, defaultValue?: T) {
    super(required, name, defaultValue);
  }

  transformValue(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalResult<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    if (isExprEvalSuccess(invocationValue)) {
      return this.transformForTypeCheck(callingExpr, invocationValue);
    }
    return this.transformForError(callingExpr, invocationValue);
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
