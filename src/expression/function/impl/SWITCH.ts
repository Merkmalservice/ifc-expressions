import {Func} from "../Func.js";
import {ExpressionValue} from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  ExprEvalTypeErrorObj,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import {FuncArg} from "../FuncArg.js";
import {ExprKind} from "../../ExprKind.js";
import {ArrayValue} from "../../../value/ArrayValue.js";
import {isNullish} from "../../../IfcExpressionUtils.js";
import {BooleanValue} from "../../../value/BooleanValue";
import {FuncArgMappings} from "../arg/FuncArgMappings";

export class SWITCH extends Func {
  private static readonly ARG_NAME_CASES = "cases";
  private static readonly ARG_NAME_DEFAULT_VALUE = "defaultValue";

  constructor() {
    super("SWITCH", [
      new FuncArgMappings(true, SWITCH.ARG_NAME_CASES),
      new FuncArg(false, SWITCH.ARG_NAME_DEFAULT_VALUE),
    ]);
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const mappings = evaluatedArguments.get(
      SWITCH.ARG_NAME_CASES
    ) as unknown as ArrayValue;
    const defaultValue = evaluatedArguments.get(
        SWITCH.ARG_NAME_DEFAULT_VALUE
    ) as unknown as ExpressionValue;
    const outerArray = mappings.getValue() as unknown as Array<ArrayValue>;
    const numMappings = outerArray.length;
    for (let i = 0; i < numMappings; i++) {
      const error= FuncArgMappings.checkSingleMapping(outerArray, i);
      if (!isNullish(error)){
        return error;
      }
      const pair = (outerArray[i] as unknown as ArrayValue).getValue();
      if (!BooleanValue.isBooleanValueType(pair[0])){
        return new ExprEvalTypeErrorObj(ExprKind.FUNCTION, `First array element at 0-based position ${i} in the mappings does not evaluate to a boolean`, pair[0]);
      }
      if (pair[0].getValue() === true) {
        return new ExprEvalSuccessObj(pair[1] as ExpressionValue);
      }
    }
    if (isNullish(defaultValue)) {
      return new ExprEvalFunctionEvaluationErrorObj(
          ExprKind.FUNCTION,
          ExprEvalStatus.UNDEFINED_RESULT,
          "Input value not found in left column. No default return value specified, therefore the result of MAP() is undefined ",
          this.name
      );
    }
    return new ExprEvalSuccessObj(defaultValue);
  }

}
