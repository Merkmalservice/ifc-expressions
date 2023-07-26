import { Func } from "../Func.js";
import { LiteralValueAnyArity } from "../../../value/LiteralValueAnyArity.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  ExprEvalTypeErrorObj,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { isNullish, LiteralValue } from "../../../IfcExpression.js";
import { FuncArg } from "../FuncArg.js";
import { ExprKind } from "../../ExprKind.js";
import { ArrayValue } from "../../../value/ArrayValue.js";

export class MAP extends Func {
  private static readonly ARG_NAME_MAPPINGS = "mappings";
  private static readonly ARG_NAME_MAPPING_INPUT = "input";
  private static readonly ARG_NAME_DEFAULT_VALUE = "defaultValue";

  constructor() {
    super("MAP", [
      new FuncArg(true, MAP.ARG_NAME_MAPPING_INPUT),
      new MappingsArg(true, MAP.ARG_NAME_MAPPINGS),
      new FuncArg(false, MAP.ARG_NAME_DEFAULT_VALUE),
    ]);
  }

  protected calculateResult(
    evaluatedArguments: Map<string, LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
    const mappings = evaluatedArguments.get(
      MAP.ARG_NAME_MAPPINGS
    ) as unknown as ArrayValue;
    const input = evaluatedArguments.get(
      MAP.ARG_NAME_MAPPING_INPUT
    ) as unknown as LiteralValueAnyArity;
    const defaultValue = evaluatedArguments.get(
      MAP.ARG_NAME_DEFAULT_VALUE
    ) as unknown as LiteralValue;
    let matchIndex = -1;
    const leftColumn = (
      mappings.getValue()[0] as unknown as ArrayValue
    ).getValue();
    const rightColumn = (
      mappings.getValue()[1] as unknown as ArrayValue
    ).getValue();
    const numMappings = leftColumn.length;
    for (let i = 0; i < numMappings; i++) {
      if (leftColumn[i].equals(input)) {
        matchIndex = i;
        break;
      }
    }
    if (matchIndex === -1) {
      if (isNullish(defaultValue)) {
        return new ExprEvalFunctionEvaluationErrorObj(
          ExprKind.FUNCTION,
          ExprEvalStatus.UNDEFINED_RESULT,
          "Input value not found in left column. No default return value specified, therefore the result of MAP() is undefined ",
          this.name
        );
      } else {
        return new ExprEvalSuccessObj(defaultValue);
      }
    }
    return new ExprEvalSuccessObj(
      rightColumn[matchIndex] as LiteralValueAnyArity
    );
  }
}

class MappingsArg extends FuncArg<any> {
  constructor(required: boolean, name: string) {
    super(required, name);
  }

  transformValue(
    invocationValue: ExprEvalResult<LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
    if (isExprEvalSuccess(invocationValue)) {
      const mappings = invocationValue.result as ArrayValue;
      if (!Array.isArray(mappings.getValue())) {
        return this.makeError(mappings, "The value is not an array");
      }
      if (mappings.getValue().length !== 2) {
        return this.makeError(mappings, "The array is not of length 2");
      }
      const firstElement = mappings.getValue()[0] as unknown as ArrayValue;
      if (!Array.isArray(firstElement.getValue())) {
        return this.makeError(
          mappings,
          "The first element of the array is not itself an array"
        );
      }
      const secondElement = mappings.getValue()[1] as unknown as ArrayValue;
      if (!Array.isArray(secondElement.getValue())) {
        return this.makeError(
          mappings,
          "The second element of the array is not itself an array"
        );
      }
      if (firstElement.getValue().length !== secondElement.getValue().length) {
        return this.makeError(
          mappings,
          `The first element of the array and the second differ in length ${
            firstElement.getValue().length
          } and ${secondElement.getValue().length}`
        );
      }
    }
    return invocationValue;
  }

  private makeError(mappings: LiteralValueAnyArity, problem: string) {
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${this.name} must be an array containing two arrays of the same length (i.e., a 2xn matrix: 2 rows, N columns). Problem: ${problem}.`,
      mappings
    );
  }
}
