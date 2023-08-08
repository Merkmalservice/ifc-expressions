import { FuncArgBase } from "./FuncArgBase.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ExprKind } from "../../ExprKind.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { Decimal } from "decimal.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";

export class FuncArgNumeric extends FuncArgBase<NumericValue> {
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
    const value = result.getValue();
    if (Decimal.isDecimal(value)) {
      return invocationValue;
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${this.name} must be a number, but was ${JSON.stringify(
        value
      )}`,
      value
    );
  }
}
