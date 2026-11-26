import { FuncArgString } from "./FuncArgString.js";
import { StringValue } from "../../../value/StringValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
  isExprEvalError,
} from "../../ExprEvalResult.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprKind } from "../../ExprKind.js";
import { isNullish } from "../../../util/IfcExpressionUtils.js";

export class FuncArgRegexFlag extends FuncArgString {
  constructor(required: boolean, name: string, defaultValue: StringValue) {
    super(required, name, defaultValue);
  }

  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const val = super.transformForTypeCheck(callingExpr, invocationValue);
    if (isExprEvalError(val)) {
      return val;
    }
    const stringValue = val.result.getValue() as string;
    if (
      isNullish(stringValue.match(/^[imguv]*$/)) || // allowed flags not found
      !isNullish(stringValue.match(/^.*([imguv]).*\1.*$/))
    ) {
      /* duplicated flags found */ return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION_ARGUMENTS,
        `Argument ${this.name} is a possibly empty collection of 'flags' for a javascript ` +
          `regular expression. Order does not matter, duplicate flags are not allowed. ` +
          `The flags are: 'g','i','m','s','u' and 'v'. The provided value, '${stringValue}' is not allowed. ` +
          `By the way the default value is '${this.defaultValue.getValue()}'`,
        callingExpr.getTextSpan()
      );
    }
    return val;
  }
}
