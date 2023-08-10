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
import { isNullish } from "../../../util/IfcExpressionUtils.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { FuncArgMappings } from "../arg/FuncArgMappings.js";
import { ExprType } from "../../../type/ExprType.js";
import { TupleType } from "../../../type/TupleType.js";
import { TypeDisjunction } from "../../../type/TypeDisjunction.js";
import { WrongFunctionArgumentTypeException } from "../../../error/WrongFunctionArgumentTypeException.js";
import { Type, Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ParserRuleContext } from "antlr4";

export class CHOOSE extends Func {
  private static readonly ARG_NAME_CASES = "cases";
  private static readonly ARG_NAME_DEFAULT_VALUE = "defaultValue";

  constructor() {
    super("CHOOSE", [
      new FuncArgMappings(true, CHOOSE.ARG_NAME_CASES),
      new FuncArg(false, CHOOSE.ARG_NAME_DEFAULT_VALUE),
    ]);
  }

  checkArgumentsAndGetReturnType(
    argumentTypes: Array<[ParserRuleContext, ExprType]>,
    ctx
  ): ExprType {
    const returnType = super.checkArgumentsAndGetReturnType(argumentTypes, ctx);
    const tupleTypes = (
      (
        (argumentTypes[0][1] as TupleType)
          .toArrayType()
          .getElementType() as TypeDisjunction
      ).getTypes()[0] as TupleType
    ).getTypes();
    const inType = tupleTypes[0];
    const outType = tupleTypes[1];
    if (!Type.BOOLEAN.overlapsWith(inType)) {
      throw new WrongFunctionArgumentTypeException(
        this.name,
        this.formalArguments[0].name,
        Type.BOOLEAN,
        inType,
        0,
        argumentTypes[0][0]
      );
    }

    if (
      argumentTypes.length > 1 &&
      !argumentTypes[1][1].overlapsWith(outType)
    ) {
      throw new WrongFunctionArgumentTypeException(
        this.name,
        this.formalArguments[1].name,
        inType,
        argumentTypes[1][1],
        1,
        argumentTypes[1][0]
      );
    }
    return returnType;
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    const returnTypes = (argumentTypes[0] as TupleType)
      .getTypes()
      .map((t) => (t as TupleType).getTypes()[1]);
    return Types.or(...returnTypes);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const mappings = evaluatedArguments.get(
      CHOOSE.ARG_NAME_CASES
    ) as unknown as ArrayValue;
    const defaultValue = evaluatedArguments.get(
      CHOOSE.ARG_NAME_DEFAULT_VALUE
    ) as unknown as ExpressionValue;
    const outerArray = mappings.getValue() as unknown as Array<ArrayValue>;
    const numMappings = outerArray.length;
    for (let i = 0; i < numMappings; i++) {
      const error = FuncArgMappings.checkSingleMapping(
        callingExpr,
        outerArray,
        i
      );
      if (!isNullish(error)) {
        return error;
      }
      const pair = (outerArray[i] as unknown as ArrayValue).getValue();
      if (!BooleanValue.isBooleanValueType(pair[0])) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION,
          `First array element at 0-based position ${i} in the mappings does not evaluate to a boolean`,
          pair[0],
          callingExpr.getTextSpan()
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
        this.name,
        callingExpr.getTextSpan()
      );
    }
    return new ExprEvalSuccessObj(defaultValue);
  }
}
