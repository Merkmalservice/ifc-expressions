import { BooleanValue } from "../../../value/BooleanValue.js";
import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgLogicalOrBoolean } from "../arg/FuncArgLogicalOrBoolean.js";
import { LogicalValue } from "../../../value/LogicalValue.js";

export class NOT extends Func {
  private static readonly KEY_ARG = "arg";

  constructor() {
    super("NOT", [new FuncArgLogicalOrBoolean(true, NOT.KEY_ARG)]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return argumentTypes[0];
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const arg = evaluatedArguments.get(NOT.KEY_ARG) as
      | BooleanValue
      | LogicalValue;
    return new ExprEvalSuccessObj(arg.not());
  }
}
