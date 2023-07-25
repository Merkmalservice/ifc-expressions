import { FuncArg } from "../FuncArg";
import {
  ExprEvalError,
  ExprEvalResult,
  ExprEvalSuccess,
  isExprEvalSuccess,
} from "../../ExprEvalResult";
import { LiteralValueAnyArity } from "../../../value/LiteralValueAnyArity";

export abstract class FuncArgBase<T> extends FuncArg<T> {
  constructor(required: boolean, name: string, defaultValue?: T) {
    super(required, name, defaultValue);
  }

  transformValue(
    invocationValue: ExprEvalResult<LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
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
    invocationValue: ExprEvalSuccess<LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
    return invocationValue;
  }

  /**
   * Override to transform the error result obtained from evaluating the invocation value.
   * @param invocationValue
   * @protected
   */
  protected transformForError(
    invocationValue: ExprEvalError
  ): ExprEvalResult<LiteralValueAnyArity> {
    return invocationValue;
  }
}
