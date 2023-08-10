import { BooleanValue } from "../../../value/BooleanValue.js";
import { Func } from "../Func.js";
import { FuncArgBoolean } from "../arg/FuncArgBoolean.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class FuncBooleanBinary extends Func {
  private static readonly KEY_LEFT = "left";
  private static readonly KEY_RIGHT = "right";
  private readonly actualCalculation: (l: boolean, r: boolean) => boolean;

  constructor(name: string, fun: (l: boolean, r: boolean) => boolean) {
    super(name, [
      new FuncArgBoolean(true, FuncBooleanBinary.KEY_LEFT),
      new FuncArgBoolean(true, FuncBooleanBinary.KEY_RIGHT),
    ]);
    this.actualCalculation = fun;
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.BOOLEAN;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const left = evaluatedArguments.get(
      FuncBooleanBinary.KEY_LEFT
    ) as BooleanValue;
    const right = evaluatedArguments.get(
      FuncBooleanBinary.KEY_RIGHT
    ) as BooleanValue;
    return new ExprEvalSuccessObj(
      BooleanValue.of(this.actualCalculation(left.getValue(), right.getValue()))
    );
  }
}
