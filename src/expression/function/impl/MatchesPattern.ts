import {ApplyRegex} from "./ApplyRegex";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalSuccessObj} from "../../ExprEvalResult";
import {StringValue} from "../../../value/StringValue";
import {BooleanValue} from "../../../value/BooleanValue";
import {isNullish} from "../../../IfcExpressionUtils";

export class MatchesPattern extends ApplyRegex {

    constructor(name: string, simplePattern: boolean, requireFullMatch: boolean) {
        super(name, simplePattern, requireFullMatch);
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        const inputValue = evaluatedArguments.get(MatchesPattern.KEY_INPUT);
        const patternValue = evaluatedArguments.get(MatchesPattern.KEY_PATTERN);
        const pattern = (patternValue as StringValue).getValue();
        if (pattern.length === 0) {
            return new ExprEvalSuccessObj(BooleanValue.of(false));
        }
        const caseSensitive = evaluatedArguments.get(MatchesPattern.KEY_CASE_INSENSITIVE)
        const flags = caseSensitive.getValue() ? "im" : "m";
        const regex = new RegExp(pattern, flags);
        const input = (inputValue as StringValue).getValue()
        const matches = input.match(regex);
        if (isNullish(matches)){
            return new ExprEvalSuccessObj(BooleanValue.of(false))
        }
        if (this.requireFullMatch) {
            return new ExprEvalSuccessObj(BooleanValue.of(matches[0] === input))
        }
        return new ExprEvalSuccessObj(BooleanValue.of(true));
    }




}