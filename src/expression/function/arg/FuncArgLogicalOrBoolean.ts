import { FuncArgBase } from "./FuncArgBase.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ExprKind } from "../../ExprKind.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { Type, Types } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { LogicalValue } from "../../../value/LogicalValue.js";

export class FuncArgLogicalOrBoolean extends FuncArgBase<
  BooleanValue | LogicalValue
> {
  constructor(
    required: boolean,
    name: string,
    defaultValue?: BooleanValue | LogicalValue
  ) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Types.or(Type.BOOLEAN, Type.LOGICAL);
  }

  protected transformForTypeCheck(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    const value = result.getValue();
    if (LogicalValue.isLogical(value)) {
      return invocationValue;
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${
        this.name
      } must be a boolean or logical, but was ${JSON.stringify(value)}`,
      value,
      callingExpr.getTextSpan()
    );
  }
}
