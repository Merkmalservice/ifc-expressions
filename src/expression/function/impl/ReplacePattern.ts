import { ApplyRegex } from "./ApplyRegex.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { Type } from "../../../type/Types.js";
import { FuncArgString } from "../arg/FuncArgString.js";
import { FuncArgRegex } from "../arg/FuncArgRegex.js";
import { MatchesPattern } from "./MatchesPattern.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class ReplacePattern extends ApplyRegex {
  private static readonly KEY_REPLACE = "replaceValue";

  constructor(name: string, simplePattern: boolean) {
    super(name, simplePattern, false);
    this.formalArguments.splice(
      2,
      0,
      simplePattern
        ? new FuncArgString(true, ReplacePattern.KEY_REPLACE)
        : new FuncArgRegex(true, ReplacePattern.KEY_REPLACE)
    );
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.STRING;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const inputValue = evaluatedArguments.get(MatchesPattern.KEY_INPUT);
    const patternValue = evaluatedArguments.get(MatchesPattern.KEY_PATTERN);
    const replaceValue = evaluatedArguments.get(ReplacePattern.KEY_REPLACE);
    const pattern = (patternValue as StringValue).getValue();
    if (pattern.length === 0) {
      return new ExprEvalSuccessObj(inputValue);
    }
    const caseSensitive = evaluatedArguments.get(
      MatchesPattern.KEY_CASE_INSENSITIVE
    );
    const flags = caseSensitive.getValue() ? "im" : "m";
    const regex = new RegExp(pattern, flags);
    const input = (inputValue as StringValue).getValue();
    const replace = (replaceValue as StringValue).getValue();
    const result = input.replace(regex, replace);
    return new ExprEvalSuccessObj(StringValue.of(result));
  }
}
