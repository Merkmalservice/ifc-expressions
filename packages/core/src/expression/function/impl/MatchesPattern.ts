import { ApplyRegex } from "./ApplyRegex.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { isNullish } from "../../../util/IfcExpressionUtils.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class MatchesPattern extends ApplyRegex {
  constructor(name: string, simplePattern: boolean, requireFullMatch: boolean) {
    super(name, simplePattern, requireFullMatch);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.BOOLEAN;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const inputValue = evaluatedArguments.get(MatchesPattern.KEY_INPUT);
    const patternValue = evaluatedArguments.get(MatchesPattern.KEY_PATTERN);
    const pattern = (patternValue as StringValue).getValue();
    if (pattern.length === 0) {
      return new ExprEvalSuccessObj(BooleanValue.of(false));
    }
    let flags = "m"; // default for simple pattern
    if (this.simplePattern) {
      const caseSensitive = evaluatedArguments.get(
        MatchesPattern.KEY_CASE_INSENSITIVE
      );
      if (caseSensitive) {
        flags = "im";
      }
    } else {
      flags = (
        evaluatedArguments.get(MatchesPattern.KEY_FLAGS) as StringValue
      ).getValue();
    }
    const regex = new RegExp(pattern, flags);
    const input = (inputValue as StringValue).getValue();
    const matches = input.match(regex);
    if (isNullish(matches)) {
      return new ExprEvalSuccessObj(BooleanValue.of(false));
    }
    if (this.requireFullMatch) {
      return new ExprEvalSuccessObj(BooleanValue.of(matches[0] === input));
    }
    return new ExprEvalSuccessObj(BooleanValue.of(true));
  }
}
