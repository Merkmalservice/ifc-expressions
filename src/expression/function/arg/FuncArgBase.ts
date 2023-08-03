import { FuncArg } from "../FuncArg.js";
import {
  ExprEvalError,
  ExprEvalResult,
  ExprEvalSuccess,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";

export abstract class FuncArgBase<T> extends FuncArg<T> {
  constructor(required: boolean, name: string, defaultValue?: T) {
    super(required, name, defaultValue);
  }

  transformValue(
    invocationValue: ExprEvalResult<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    if (isExprEvalSuccess(invocationValue)) {
      return this.transformForTypeCheck(invocationValue);
    }
    return this.transformForError(invocationValue);
  }

  /**
   * Override to type-check the successfully evaluated invocationValue.
   * @param result
   * @protected
   */
  protected transformForTypeCheck(
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
    invocationValue: ExprEvalError
  ): ExprEvalResult<ExpressionValue> {
    return invocationValue;
  }
}
