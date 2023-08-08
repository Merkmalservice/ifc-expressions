import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
} from "../../ExprEvalResult.js";
import { FuncArg } from "../FuncArg.js";
import { ExprKind } from "../../ExprKind.js";
import { ArrayValue } from "../../../value/ArrayValue.js";
import { isNullish } from "../../../IfcExpressionUtils.js";
import { FuncArgMappings } from "../arg/FuncArgMappings.js";
import { ExprType } from "../../../type/ExprType.js";
import { TupleType } from "../../../type/TupleType.js";
import { Types } from "../../../type/Types.js";
import { TypeDisjunction } from "../../../type/TypeDisjunction.js";
import { WrongFunctionArgumentTypeException } from "../../../error/WrongFunctionArgumentTypeException.js";

export class MAP extends Func {
  private static readonly ARG_NAME_MAPPINGS = "mappings";
  private static readonly ARG_NAME_MAPPING_INPUT = "input";
  private static readonly ARG_NAME_DEFAULT_VALUE = "defaultValue";

  constructor() {
    super("MAP", [
      new FuncArg(true, MAP.ARG_NAME_MAPPING_INPUT),
      new FuncArgMappings(true, MAP.ARG_NAME_MAPPINGS),
      new FuncArg(false, MAP.ARG_NAME_DEFAULT_VALUE),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Types.or(...(argumentTypes[1] as TupleType).getTypes())
      .getTypes()
      .map((t) => (t as TupleType).getTypes()[1])[0];
  }

  checkArgumentsAndGetReturnType(
    argumentTypes: Array<ExprType>,
    ctx
  ): ExprType {
    const returnType = super.checkArgumentsAndGetReturnType(argumentTypes, ctx);
    const tupleTypes = (
      (
        (argumentTypes[1] as TupleType)
          .toArrayType()
          .getElementType() as TypeDisjunction
      ).getTypes()[0] as TupleType
    ).getTypes();
    const inType = tupleTypes[0];
    const outType = tupleTypes[1];
    if (!argumentTypes[0].overlapsWith(inType)) {
      throw new WrongFunctionArgumentTypeException(
        this.name,
        this.formalArguments[0].name,
        inType,
        argumentTypes[0],
        0,
        ctx
      );
    }
    if (argumentTypes.length > 2 && !argumentTypes[2].overlapsWith(outType)) {
      throw new WrongFunctionArgumentTypeException(
        this.name,
        this.formalArguments[2].name,
        inType,
        argumentTypes[2],
        2,
        ctx
      );
    }
    return returnType;
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const mappings = evaluatedArguments.get(
      MAP.ARG_NAME_MAPPINGS
    ) as unknown as ArrayValue;
    const input = evaluatedArguments.get(
      MAP.ARG_NAME_MAPPING_INPUT
    ) as unknown as ExpressionValue;
    const defaultValue = evaluatedArguments.get(
      MAP.ARG_NAME_DEFAULT_VALUE
    ) as unknown as ExpressionValue;
    const outerArray = mappings.getValue() as unknown as Array<ArrayValue>;
    const numMappings = outerArray.length;
    for (let i = 0; i < numMappings; i++) {
      const error = FuncArgMappings.checkSingleMapping(outerArray, i);
      if (!isNullish(error)) {
        return error;
      }
      const pair = (outerArray[i] as unknown as ArrayValue).getValue();
      if (pair[0].equals(input)) {
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
