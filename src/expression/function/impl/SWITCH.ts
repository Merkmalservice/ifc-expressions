import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { FuncArg } from "../FuncArg.js";
import { ExprKind } from "../../ExprKind.js";
import { ArrayValue } from "../../../value/ArrayValue.js";
import { isNullish } from "../../../IfcExpressionUtils.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { FuncArgMappings } from "../arg/FuncArgMappings.js";
import { ExprType } from "../../../type/ExprType.js";
import { TupleType } from "../../../type/TupleType.js";
import { TypeDisjunction } from "../../../type/TypeDisjunction.js";
import { WrongFunctionArgumentTypeException } from "../../../error/WrongFunctionArgumentTypeException.js";
import { Type } from "../../../type/Types.js";

export class SWITCH extends Func {
  private static readonly ARG_NAME_CASES = "cases";
  private static readonly ARG_NAME_DEFAULT_VALUE = "defaultValue";

  constructor() {
    super("SWITCH", [
      new FuncArgMappings(true, SWITCH.ARG_NAME_CASES),
      new FuncArg(false, SWITCH.ARG_NAME_DEFAULT_VALUE),
    ]);
  }

  checkArgumentsAndGetReturnType(
    argumentTypes: Array<ExprType>,
    ctx
  ): ExprType {
    const returnType = super.checkArgumentsAndGetReturnType(argumentTypes, ctx);
    const tupleTypes = (
      (
        (argumentTypes[0] as TupleType)
          .toArrayType()
          .getElementType() as TypeDisjunction
      ).getTypes()[0] as TupleType
    ).getTypes();
    const inType = tupleTypes[0];
    const outType = tupleTypes[1];
    if (!Type.BOOLEAN.isSameTypeAs(inType)) {
      throw new WrongFunctionArgumentTypeException(
        this.name,
        this.formalArguments[0].name,
        Type.BOOLEAN,
        inType,
        0,
        ctx
      );
    }

    if (argumentTypes.length > 1 && !argumentTypes[1].isSameTypeAs(outType)) {
      throw new WrongFunctionArgumentTypeException(
        this.name,
        this.formalArguments[1].name,
        inType,
        argumentTypes[1],
        1,
        ctx
      );
    }
    return returnType;
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return (argumentTypes[0] as TupleType).getTypes()[1];
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
      const error = FuncArgMappings.checkSingleMapping(outerArray, i);
      if (!isNullish(error)) {
        return error;
      }
      const pair = (outerArray[i] as unknown as ArrayValue).getValue();
      if (!BooleanValue.isBooleanValueType(pair[0])) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION,
          `First array element at 0-based position ${i} in the mappings does not evaluate to a boolean`,
          pair[0]
        );
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
