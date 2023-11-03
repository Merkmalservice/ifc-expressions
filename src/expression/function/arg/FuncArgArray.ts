import { FuncArgBase } from "./FuncArgBase";
import { ArrayValue } from "../../../value/ArrayValue";
import { ExprType } from "../../../type/ExprType";
import { Type, Types } from "../../../type/Types";
import { FunctionExpr } from "../FunctionExpr";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult";
import { ExpressionValue } from "../../../value/ExpressionValue";
import { ExprKind } from "../../ExprKind";

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
