import { BooleanValue } from "../../../value/BooleanValue.js";
import { Func } from "../Func.js";
import { FuncArgBoolean } from "../arg/FuncArgBoolean.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";

export class NOT extends Func {
  private static readonly KEY_ARG = "arg";

  constructor() {
    super("NOT", [new FuncArgBoolean(true, NOT.KEY_ARG)]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.BOOLEAN;
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const arg = evaluatedArguments.get(NOT.KEY_ARG) as BooleanValue;
    return new ExprEvalSuccessObj(BooleanValue.of(!arg.getValue()));
  }
}
