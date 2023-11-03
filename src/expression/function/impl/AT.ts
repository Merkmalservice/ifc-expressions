import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { ExprType } from "../../../type/ExprType.js";
import { Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgNumeric } from "../arg/FuncArgNumeric";
import { NumericValue } from "../../../value/NumericValue";
import { FuncArgArray } from "../arg/FuncArgArray";
import { ArrayValue } from "../../../value/ArrayValue";
import { TupleType } from "../../../type/TupleType";
import { ArrayType } from "../../../type/ArrayType";

export class AT extends Func {
  constructor() {
    super("AT", [
      new FuncArgArray(true, "input"),
      new FuncArgNumeric(true, "index"),
    ]);
  }
  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const inputArray = (
      evaluatedArguments.get("input") as ArrayValue
    ).getValue();
    const index = (evaluatedArguments.get("index") as NumericValue).getValue();
    return new ExprEvalSuccessObj(
      inputArray.at(index.toNumber()) as ExpressionValue
    );
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    const arrType = argumentTypes[0];
    if (arrType instanceof TupleType) {
      return Types.or(...arrType.getTypes());
    }
    return (arrType as ArrayType).getElementType();
  }
}
