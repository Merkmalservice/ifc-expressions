import {
  ExprEvalResult,
  ExprEvalSuccess,
  isExprEvalError,
} from "../../ExprEvalResult.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { FuncArgBase } from "./FuncArgBase.js";

export class FuncArgIfcDateTime extends FuncArgBase<IfcDateTimeValue> {
  constructor(
    required: boolean,
    name: string,
    defaultValue?: IfcDateTimeValue
  ) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.or(Type.IFC_DATE_TIME);
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
    if (result instanceof IfcDateTimeValue) {
      return val;
    }
  }
}
