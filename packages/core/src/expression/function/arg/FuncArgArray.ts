import { FuncArgBase } from "./FuncArgBase.js";
import { ArrayValue } from "../../../value/ArrayValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprKind } from "../../ExprKind.js";

export class FuncArgArray extends FuncArgBase<ArrayValue> {
  constructor(required: boolean, name: string, defaultValue?: ArrayValue) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.array(Type.ANY);
  }

  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    const value = result.getValue();
    if (Array.isArray(value)) {
      return invocationValue;
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${this.name} must be an array, but was ${JSON.stringify(
        value
      )}`,
      value,
      callingExpr.getTextSpan()
    );
  }
}
