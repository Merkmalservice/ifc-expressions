import { FuncArgBase } from "./FuncArgBase";
import { LiteralValueAnyArity } from "../../../value/LiteralValueAnyArity";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult";
import { ExprKind } from "../../ExprKind";
import { NumericValue } from "../../../value/NumericValue";
import { Decimal } from "decimal.js";

export class FuncArgNumeric extends FuncArgBase<NumericValue> {
  constructor(required: boolean, name: string, defaultValue?: NumericValue) {
    super(required, name, defaultValue);
  }

  protected transformForTypeCheck(
    invocationValue: ExprEvalSuccess<LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
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
