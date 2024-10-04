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
import { IfcTimeValue } from "../../../value/IfcTimeValue.js";
import { FuncArgBase } from "./FuncArgBase.js";

export class FuncArgIfcTimeString extends FuncArgBase<StringValue> {
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
    if (val.result instanceof StringValue) {
      const stringValue = val.result.getValue() as string;
      if (!IfcTimeValue.isValidStringRepresentation(stringValue)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          `Argument ${this.name} is an IfcTime of the form 'HH:MM:SS.sss...'.` +
            `a trailing time zone specification is allowed.` +
            `The provided value, '${stringValue}' is not allowed. `,
          callingExpr.getTextSpan()
        );
      }
      return val;
    }
  }
}
