import { FuncArgBase } from "./FuncArgBase.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ExprKind } from "../../ExprKind.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";

export class FuncArgInt extends FuncArgBase<NumericValue> {
  constructor(required: boolean, name: string, defaultValue?: NumericValue) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Type.NUMERIC;
  }

  protected transformForTypeCheck(
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    if (!NumericValue.isNumericValueType(result)) {
      return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION_ARGUMENTS,
        `Argument ${this.name} must be a NumericValue, but was ${result}`,
        result
      );
    }
    const value = result.numericValue;
    if (value.isInteger()) {
      return invocationValue;
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Value of argument ${this.name} must be an integer, but was ${value}`,
      value
    );
  }
}
