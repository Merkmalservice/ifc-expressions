import { FuncArgRegex } from "./FuncArgRegex.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";

export class FuncArgSimpleRegex extends FuncArgRegex {
  constructor(required: boolean, name: string, defaultValue?: StringValue) {
    super(required, name, defaultValue);
  }

  protected toRegexString(
    patternString: StringValue
  ): ExprEvalResult<StringValue> {
    const pattern = patternString.getValue();
    const transformedPattern = pattern
      .replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&") // escape all js REGEX special chars
      .replaceAll(/\\\*/g, ".*");
    return new ExprEvalSuccessObj(StringValue.of(transformedPattern));
  }
}
