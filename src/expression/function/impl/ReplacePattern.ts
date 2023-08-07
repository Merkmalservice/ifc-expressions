import {ApplyRegex} from "./ApplyRegex";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalSuccessObj} from "../../ExprEvalResult";
import {StringValue} from "../../../value/StringValue";
import {BooleanValue} from "../../../value/BooleanValue";
import {isNullish} from "../../../IfcExpressionUtils";
import {Type} from "../../../parse/Types";
import {FuncArgString} from "../arg/FuncArgString";
import {FuncArgSimpleRegex} from "../arg/FuncArgSimpleRegex";
import {FuncArgRegex} from "../arg/FuncArgRegex";
import {MatchesPattern} from "./MatchesPattern";

export class ReplacePattern extends ApplyRegex {

    private static readonly KEY_REPLACE = "replaceValue";

    constructor(name: string, simplePattern: boolean) {
        super(name, simplePattern, false);
        this.formalArguments.splice( 2, 0, simplePattern
            ? new FuncArgString(true,ReplacePattern.KEY_REPLACE)
            : new FuncArgRegex(true, ReplacePattern.KEY_REPLACE));
    }

    getReturnType(): Type {
        return Type.STRING;
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        const inputValue = evaluatedArguments.get(MatchesPattern.KEY_INPUT);
        const patternValue = evaluatedArguments.get(MatchesPattern.KEY_PATTERN);
        const replaceValue = evaluatedArguments.get(ReplacePattern.KEY_REPLACE);
        const pattern = (patternValue as StringValue).getValue();
        if (pattern.length === 0) {
            return new ExprEvalSuccessObj(inputValue);
        }
        const caseSensitive = evaluatedArguments.get(MatchesPattern.KEY_CASE_INSENSITIVE)
        const flags = caseSensitive.getValue() ? "im" : "m";
        const regex = new RegExp(pattern, flags);
        const input = (inputValue as StringValue).getValue()
        const replace = (replaceValue as StringValue).getValue();
        const result = input.replace(regex, replace);
        return new ExprEvalSuccessObj(StringValue.of(result));
    }




}