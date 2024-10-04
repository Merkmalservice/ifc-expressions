import { Func } from "../Func.js";
import { FuncArgString } from "../arg/FuncArgString.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgNumeric } from "../arg/FuncArgNumeric.js";
import { NumericValue } from "../../../value/NumericValue.js";

export class SUBSTRING extends Func {
  constructor() {
    super("SUBSTRING", [
      new FuncArgString(true, "input"),
      new FuncArgNumeric(true, "fromIncl"),
      new FuncArgNumeric(false, "toExcl"),
    ]);
  }
  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const inputString = (
      evaluatedArguments.get("input") as StringValue
    ).getValue();
    const fromIncl = (
      evaluatedArguments.get("fromIncl") as NumericValue
    ).getValue();
    let result;
    if (evaluatedArguments.has("toExcl")) {
      const toExcl = (
        evaluatedArguments.get("toExcl") as NumericValue
      ).getValue();
      result = inputString.substring(fromIncl.toNumber(), toExcl.toNumber());
    } else {
      result = inputString.substring(fromIncl.toNumber());
    }
    return new ExprEvalSuccessObj(StringValue.of(result));
  }

  public getReturnType(argumentTypes: ExprType[]): ExprType {
    return Type.STRING;
  }
}
