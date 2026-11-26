import {
  ExprEvalResult,
  ExprEvalSuccess,
  isExprEvalError,
} from "../../ExprEvalResult.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { IfcTimeStampValue } from "../../../value/IfcTimeStampValue.js";
import { FuncArgBase } from "./FuncArgBase.js";

export class FuncArgIfcTimeStamp extends FuncArgBase<IfcTimeStampValue> {
  constructor(
    required: boolean,
    name: string,
    defaultValue?: IfcTimeStampValue
  ) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.or(Type.IFC_TIME_STAMP);
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
    if (result instanceof IfcTimeStampValue) {
      return val;
    }
  }
}
