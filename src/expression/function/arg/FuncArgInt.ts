import { FuncArgBase } from "./FuncArgBase";
import { LiteralValueAnyArity } from "../../../value/LiteralValueAnyArity";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult";
import { ExprKind } from "../../ExprKind";
import { NumericValue } from "../../../value/NumericValue";

export class FuncArgInt extends FuncArgBase<NumericValue> {
  constructor(required: boolean, name: string, defaultValue?: NumericValue) {
    super(required, name, defaultValue);
  }

  protected transformForTypeCheck(
    invocationValue: ExprEvalSuccess<LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
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
