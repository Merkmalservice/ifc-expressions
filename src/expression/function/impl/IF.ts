import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgBoolean } from "../arg/FuncArgBoolean";
import { FuncArgAny } from "../arg/FuncArgAny";

export class IF extends Func {
  private static readonly ARG_NAME_CONDITION = "condition";
  private static readonly ARG_NAME_THEN = "thenValue";
  private static readonly ARG_NAME_ELSE = "elseValue";

  constructor() {
    super("IF", [
      new FuncArgBoolean(true, IF.ARG_NAME_CONDITION),
      new FuncArgAny(true, IF.ARG_NAME_THEN),
      new FuncArgAny(true, IF.ARG_NAME_ELSE),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Types.or(argumentTypes[1], argumentTypes[2]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const condition = evaluatedArguments.get(
      IF.ARG_NAME_CONDITION
    ) as BooleanValue;
    if (condition.getValue()) {
      const thenValue = evaluatedArguments.get(IF.ARG_NAME_THEN);
      return new ExprEvalSuccessObj(thenValue);
    }
    const elseValue = evaluatedArguments.get(IF.ARG_NAME_ELSE);
    return new ExprEvalSuccessObj(elseValue);
  }
}
