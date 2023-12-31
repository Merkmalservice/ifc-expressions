import { FuncArg } from "../FuncArg.js";
import {
  ExprEvalError,
  ExprEvalResult,
  ExprEvalTypeErrorObj,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ArrayValue } from "../../../value/ArrayValue.js";
import { ExprKind } from "../../ExprKind.js";
import { Type, Types } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class FuncArgMappings extends FuncArg<any> {
  constructor(required: boolean, name: string) {
    super(required, name);
  }

  getType(): ExprType {
    return Types.array(Types.tuple(Type.ANY, Type.ANY));
  }

  transformValue(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalResult<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    if (isExprEvalSuccess(invocationValue)) {
      const mappings = invocationValue.result as ArrayValue;
      if (!Array.isArray(mappings.getValue())) {
        return FuncArgMappings.makeError(
          callingExpr,
          mappings,
          "The value is not an array"
        );
      }
      const arr = mappings.getValue();
      if (arr.length === 0) {
        return FuncArgMappings.makeError(
          callingExpr,
          mappings,
          "The mappings array is empty"
        );
      }
    }
    return invocationValue;
  }

  public static checkSingleMapping(
    callingExpr: FunctionExpr,
    mappings: Array<ArrayValue>,
    index: number
  ): ExprEvalError | undefined {
    const element = mappings[index];
    if (!ArrayValue.isArrayValueType(element)) {
      return FuncArgMappings.makeError(
        callingExpr,
        element,
        `The element at 0-based position${index} is not an array: ${JSON.stringify(
          element
        )}`
      );
    }
    const pair = (element as unknown as ArrayValue).getValue();
    if (pair.length !== 2) {
      return FuncArgMappings.makeError(
        callingExpr,
        element,
        `The array at 0-based position ${index} must be of length 2 but is of length ${pair.length}`
      );
    }
    return undefined;
  }

  private static makeError(
    callingExpr: FunctionExpr,
    mappings: ExpressionValue,
    problem: string
  ) {
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${this.name} must be an array containing two arrays of the same length (i.e., a 2xn matrix: 2 rows, N columns). Problem: ${problem}.`,
      mappings,
      callingExpr.getTextSpan()
    );
  }
}
