import { Func } from "../Func.js";
import { FuncArgInt } from "../arg/FuncArgInt.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { FuncArgNumeric } from "../arg/FuncArgNumeric.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { Decimal } from "decimal.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class ROUND extends Func {
  private static KEY_INPUT = "input";
  private static KEY_NUM_DECMIALS = "num_decimals";

  constructor() {
    super("ROUND", [
      new FuncArgNumeric(true, ROUND.KEY_INPUT),
      new FuncArgInt(false, ROUND.KEY_NUM_DECMIALS, new NumericValue(0)),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.NUMERIC;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const input = evaluatedArguments.get(ROUND.KEY_INPUT) as NumericValue;
    const numDecimals = evaluatedArguments.get(
      ROUND.KEY_NUM_DECMIALS
    ) as NumericValue;
    const rounded = input
      .getValue()
      .toDecimalPlaces(
        numDecimals.getValue().toNumber(),
        Decimal.ROUND_HALF_UP
      );
    return new ExprEvalSuccessObj(new NumericValue(rounded));
  }
}
