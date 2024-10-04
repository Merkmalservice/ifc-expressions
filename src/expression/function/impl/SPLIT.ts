import { Func } from "../Func.js";
import { FuncArgString } from "../arg/FuncArgString.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgNumeric } from "../arg/FuncArgNumeric.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { ArrayValue } from "../../../value/ArrayValue.js";

export class SPLIT extends Func {
  constructor() {
    super("SPLIT", [
      new FuncArgString(true, "input"),
      new FuncArgString(true, "separator"),
      new FuncArgNumeric(false, "limit"),
    ]);
  }
  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const inputString = (
      evaluatedArguments.get("input") as StringValue
    ).getValue();
    const separator = (
      evaluatedArguments.get("separator") as StringValue
    ).getValue();
    let result;
    if (!evaluatedArguments.has("limit")) {
      result = inputString.split(separator);
    } else {
      let limit = (evaluatedArguments.get("limit") as NumericValue).getValue();
      result = inputString.split(separator, limit.toNumber());
    }
    return new ExprEvalSuccessObj(
      ArrayValue.of(result.map((x) => StringValue.of(x)))
    );
  }

  public getReturnType(argumentTypes: ExprType[]): ExprType {
    return Types.array(Type.STRING);
  }
}
