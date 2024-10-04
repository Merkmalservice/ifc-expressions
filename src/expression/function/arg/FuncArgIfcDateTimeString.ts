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
import { Type, Types } from "../../../type/Types.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { FuncArgBase } from "./FuncArgBase.js";

export class FuncArgIfcDateTimeString extends FuncArgBase<StringValue> {
  constructor(required: boolean, name: string, defaultValue?: StringValue) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.or(Type.STRING);
  }

  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const val = super.transformForTypeCheck(callingExpr, invocationValue);
    if (isExprEvalError(val)) {
      return val;
    }
    const result = val.result;
    if (result instanceof StringValue) {
      const stringValue = result.getValue() as string;
      if (!IfcDateTimeValue.isValidStringRepresentation(stringValue)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          `Argument ${this.name} is an IfcDateTime of the form 'YYYY-MM-DDTHH:MM:SS.sss...', ` +
            `a leading + or - and a trailing time zone specification are allowed.` +
            `The provided value, '${stringValue}' is not allowed. `,
          callingExpr.getTextSpan()
        );
      }
      return val;
    }
  }
}
