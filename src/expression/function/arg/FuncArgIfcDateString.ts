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
import { IfcDateValue } from "../../../value/IfcDateValue.js";
import { FuncArgBase } from "./FuncArgBase.js";

export class FuncArgIfcDateString extends FuncArgBase<StringValue> {
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
      if (!IfcDateValue.isValidStringRepresentation(stringValue)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          `Argument ${this.name} is an IfcDate of the form 'YYYY-MM-DD', optionally with` +
            `leading + or -, and trailing time zone specification.` +
            `The provided value, '${stringValue}' is not allowed.`,
          callingExpr.getTextSpan()
        );
      }
      return val;
    }
  }
}
