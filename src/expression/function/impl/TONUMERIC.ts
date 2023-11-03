import { Func } from "../Func.js";
import { FuncArgAny } from "../arg/FuncArgAny.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
} from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { NumericValue } from "../../../value/NumericValue";
import { Decimal } from "decimal.js";
import { BooleanValue } from "../../../value/BooleanValue";
import { LogicalValue } from "../../../value/LogicalValue";
import { ReferenceValue } from "../../../value/ReferenceValue";

export class TONUMERIC extends Func {
  private static readonly KEY_OBJECT = "object";
  constructor() {
    super("TONUMERIC", [new FuncArgAny(true, "object")]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const val = evaluatedArguments.get("object");
    try {
      return new ExprEvalSuccessObj(NumericValue.of(this.convert(val)));
    } catch (e) {
      return new ExprEvalFunctionEvaluationErrorObj(
        callingExpr.getKind(),
        ExprEvalStatus.MATH_ERROR,
        `Cannot convert ${val.getValue()} to numeric: ${e.message}`,
        this.name,
        callingExpr.getTextSpan()
      );
    }
  }

  private convert(value: ExpressionValue): Decimal {
    if (value instanceof BooleanValue) {
      return value.getValue() ? new Decimal(1) : new Decimal(0);
    }
    if (value instanceof StringValue || value instanceof ReferenceValue) {
      return new Decimal(value.getValue());
    }
    if (value instanceof NumericValue) {
      return value.getValue();
    }
    if (value instanceof LogicalValue) {
      return value.getValue() === "UNKNOWN"
        ? new Decimal(-1)
        : value.getValue()
        ? new Decimal(1)
        : new Decimal(0);
    }
    throw new Error(
      `numeric conversion not implemented for type ${value.constructor.name}`
    );
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.NUMERIC;
  }
}
