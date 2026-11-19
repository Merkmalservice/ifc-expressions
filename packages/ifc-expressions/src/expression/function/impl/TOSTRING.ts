import { Func } from "../Func.js";
import { FuncArgAny } from "../arg/FuncArgAny.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class TOSTRING extends Func {
  constructor() {
    super("TOSTRING", [new FuncArgAny(true, "object")]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    return new ExprEvalSuccessObj(
      StringValue.of(evaluatedArguments.get("object").toString())
    );
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.STRING;
  }
}
