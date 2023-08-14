import { BooleanValue } from "../../../value/BooleanValue.js";
import { Func } from "../Func.js";
import { FuncArgBoolean } from "../arg/FuncArgBoolean.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { Type, Types } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgLogicalOrBoolean } from "../arg/FuncArgLogicalOrBoolean";
import { Logical, LogicalValue } from "../../../value/LogicalValue";

export class FuncBooleanBinary extends Func {
  private static readonly KEY_LEFT = "left";
  private static readonly KEY_RIGHT = "right";
  private readonly methodName: string;

  constructor(name: string, methodName: string) {
    super(name, [
      new FuncArgLogicalOrBoolean(true, FuncBooleanBinary.KEY_LEFT),
      new FuncArgLogicalOrBoolean(true, FuncBooleanBinary.KEY_RIGHT),
    ]);
    this.methodName = methodName;
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Types.or(...argumentTypes);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const left = evaluatedArguments.get(FuncBooleanBinary.KEY_LEFT) as
      | BooleanValue
      | LogicalValue;
    const right = evaluatedArguments.get(FuncBooleanBinary.KEY_RIGHT) as
      | BooleanValue
      | LogicalValue;
    return new ExprEvalSuccessObj(left[this.methodName].call(left, right));
  }
}
