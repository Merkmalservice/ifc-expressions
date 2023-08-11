import { Func } from "../Func.js";
import { FuncArgAny } from "../arg/FuncArgAny.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  ExprEvalWrongFunctionArgumentTypeErrorObj,
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
import { isNullish } from "../../../util/IfcExpressionUtils";

export class TOBOOLEAN extends Func {
  private static readonly KEY_OBJECT = "object";
  constructor() {
    super("TOBOOLEAN", [new FuncArgAny(true, "object")]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const val = evaluatedArguments.get("object");
    try {
      return new ExprEvalSuccessObj(BooleanValue.of(this.convert(val)));
    } catch (e) {
      return new ExprEvalFunctionEvaluationErrorObj(
        callingExpr.getKind(),
        ExprEvalStatus.ERROR,
        `Cannot convert ${val.getValue()} to boolean: ${e.message}`,
        this.name,
        callingExpr.getTextSpan()
      );
    }
  }

  private convert(value: ExpressionValue): boolean {
    if (value instanceof BooleanValue) {
      return value.getValue();
    }
    if (value instanceof StringValue || value instanceof ReferenceValue) {
      switch (value.getValue()) {
        case "TRUE":
        case "true":
        case "1":
          return true;
        case "FALSE":
        case "false":
        case "0":
          return false;
        default:
          throw new Error(`Not a boolean value: ${value.getValue()}`);
      }
    }
    if (value instanceof NumericValue) {
      const val: Decimal = value.getValue();
      if (val.isZero()) {
        return false;
      }
      if (val.toNumber() === 1) {
        return true;
      }
      throw new Error("Can only convert 0 or 1 to boolean");
    }
    if (value instanceof LogicalValue) {
      const val = value.getValue();
      if (val === true) {
        return true;
      }
      if (val === false) {
        return false;
      }
      throw new Error("Can only convert 0 or 1 to boolean");
    }
    throw new Error(
      `numeric conversion not implemented for type ${value.constructor.name}`
    );
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.STRING;
  }
}
