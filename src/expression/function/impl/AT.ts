import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { ExprType } from "../../../type/ExprType.js";
import { Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgNumeric } from "../arg/FuncArgNumeric.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { FuncArgArray } from "../arg/FuncArgArray.js";
import { ArrayValue } from "../../../value/ArrayValue.js";
import { TupleType } from "../../../type/TupleType.js";
import { ArrayType } from "../../../type/ArrayType.js";

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
