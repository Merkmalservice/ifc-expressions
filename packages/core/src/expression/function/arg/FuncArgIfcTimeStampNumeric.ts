import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprKind } from "../../ExprKind.js";
import { FuncArgNumeric } from "./FuncArgNumeric.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { Decimal } from "decimal.js";

export class FuncArgIfcTimeStampNumeric extends FuncArgNumeric {
  constructor(required: boolean, name: string, defaultValue?: NumericValue) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.or(Type.NUMERIC);
  }

  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    if (result instanceof NumericValue) {
      const value = result.getValue() as Decimal;
      if (value.isInteger()) {
        return invocationValue;
      }
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${
        this.name
      } must be an integer or an IfcDateTimeValue, but was ${JSON.stringify(
        result.getValue()
      )}`,
      result.getValue(),
      callingExpr.getTextSpan()
    );
  }
}
