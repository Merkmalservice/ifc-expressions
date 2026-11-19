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
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { IfcDurationValue } from "../../../value/IfcDurationValue.js";

export class FuncArgIfcDurationString extends FuncArgString {
  constructor(required: boolean, name: string, defaultValue?: StringValue) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Type.STRING;
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
    if (!IfcDurationValue.isValidStringRepresentation(stringValue)) {
      return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION_ARGUMENTS,
        `Argument ${this.name} is an IfcDate of the form 'YYYY-MM-DD'.` +
          `The provided value, '${stringValue}' is not allowed. `,
        callingExpr.getTextSpan()
      );
    }
    return val;
  }
}
