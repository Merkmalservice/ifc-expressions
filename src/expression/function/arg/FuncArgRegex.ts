import {FuncArgBase} from "./FuncArgBase.js";
import {ExpressionValue} from "../../../value/ExpressionValue.js";
import {ExprEvalResult, ExprEvalSuccess, ExprEvalSuccessObj, ExprEvalTypeErrorObj,} from "../../ExprEvalResult.js";
import {ExprKind} from "../../ExprKind.js";
import {StringValue} from "../../../value/StringValue.js";

export class FuncArgRegex extends FuncArgBase<StringValue> {
  constructor(required: boolean, name: string, defaultValue?: StringValue) {
    super(required, name, defaultValue);
  }

  protected transformForTypeCheck(
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    if (result instanceof StringValue) {
      return this.toRegexString(result);
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${this.name} must be a string, but was ${JSON.stringify(
        result
      )}`,
      result
    );
  }

  protected toRegexString(patternString: StringValue): ExprEvalResult<StringValue> {
    return new ExprEvalSuccessObj(patternString);
  }
}
