import { Func } from "../Func.js";
import { FuncArgString } from "../arg/FuncArgString.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class TOUPPERCASE extends Func {
  constructor() {
    super("TOUPPERCASE", [new FuncArgString(true, "object")]);
  }
  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    return new ExprEvalSuccessObj(
      StringValue.of(
        (evaluatedArguments.get("object") as StringValue)
          .getValue()
          .toUpperCase()
      )
    );
  }

  public getReturnType(argumentTypes: ExprType[]): ExprType {
    return Type.STRING;
  }
}
