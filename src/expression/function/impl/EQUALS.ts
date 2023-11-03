import { Func } from "../Func.js";
import { FuncArgAny } from "../arg/FuncArgAny.js";
import { Type } from "../../../type/Types.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class EQUALS extends Func {
  protected static readonly KEY_LEFT = "left";
  protected static readonly KEY_RIGHT = "right";

  constructor() {
    super("EQUALS", [
      new FuncArgAny(true, EQUALS.KEY_LEFT),
      new FuncArgAny(true, EQUALS.KEY_RIGHT),
    ]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const left = evaluatedArguments.get(EQUALS.KEY_LEFT);
    const right = evaluatedArguments.get(EQUALS.KEY_RIGHT);
    return new ExprEvalSuccessObj(BooleanValue.of(left.equals(right)));
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.BOOLEAN;
  }
}
