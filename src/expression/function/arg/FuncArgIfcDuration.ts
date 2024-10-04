import {
  ExprEvalResult,
  ExprEvalSuccess,
  isExprEvalError,
} from "../../ExprEvalResult.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { IfcDurationValue } from "../../../value/IfcDurationValue.js";
import { FuncArgBase } from "./FuncArgBase.js";

export class FuncArgIfcDuration extends FuncArgBase<IfcDurationValue> {
  constructor(
    required: boolean,
    name: string,
    defaultValue?: IfcDurationValue
  ) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.or(Type.IFC_DURATION);
  }

  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const val = super.transformForTypeCheck(callingExpr, invocationValue);
    if (isExprEvalError(val)) {
      return val;
    }
    const result = val.result;
    if (result instanceof IfcDurationValue) {
      return val;
    }
  }
}
