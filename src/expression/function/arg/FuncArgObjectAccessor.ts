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
import { ObjectAccessorValue } from "../../../value/ObjectAccessorValue.js";
import { ObjectAccessor } from "../../../IfcExpression.js";
import { isObjectAccessor } from "../../../context/ObjectAccessor.js";

export class FuncArgObjectAccessor extends FuncArgBase<ObjectAccessorValue> {
  constructor(
    required: boolean,
    name: string,
    defaultValue?: ObjectAccessorValue
  ) {
    super(required, name, defaultValue);
  }

  protected transformForTypeCheck(
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    const value = result.getValue();
    if (isObjectAccessor(value)) {
      return invocationValue;
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${
        this.name
      } must be an ObjectAccessor, but was ${JSON.stringify(value)}`,
      value
    );
  }
}
