import { Func } from "../Func.js";
import { FuncArgInt } from "../arg/FuncArgInt.js";
import { NumericValue } from "../../../value/NumericValue.js";
import { FuncArgNumeric } from "../arg/FuncArgNumeric.js";
import { LiteralValueAnyArity } from "../../../value/LiteralValueAnyArity.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { Decimal } from "decimal.js";

export class ROUND extends Func {
  private static KEY_INPUT = "input";
  private static KEY_NUM_DECMIALS = "num_decimals";

  constructor() {
    super("ROUND", [
      new FuncArgNumeric(true, ROUND.KEY_INPUT),
      new FuncArgInt(false, ROUND.KEY_NUM_DECMIALS, new NumericValue(0)),
    ]);
  }

  protected calculateResult(
    evaluatedArguments: Map<string, LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
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
