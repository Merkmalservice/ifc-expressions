import {Func} from "../Func";
import {FuncArgString} from "../arg/FuncArgString";
import {FuncArgSimpleRegex} from "../arg/FuncArgSimpleRegex";
import {FuncArgRegex} from "../arg/FuncArgRegex";
import {FuncArgBoolean} from "../arg/FuncArgBoolean";
import {BooleanValue} from "../../../value/BooleanValue";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult} from "../../ExprEvalResult";

export abstract class ApplyRegex extends Func {
    protected static readonly KEY_INPUT="input";
    protected static readonly KEY_PATTERN="pattern";
    protected static readonly KEY_CASE_INSENSITIVE="caseInsensitive";

    protected readonly requireFullMatch: boolean;

    constructor(name: string, simplePattern: boolean, requireFullMatch: boolean) {
        super(name, [
            new FuncArgString(true, ApplyRegex.KEY_INPUT),
            simplePattern ?
                new FuncArgSimpleRegex(true, ApplyRegex.KEY_PATTERN) :
                new FuncArgRegex(true, ApplyRegex.KEY_PATTERN),
            new FuncArgBoolean(false, ApplyRegex.KEY_CASE_INSENSITIVE, BooleanValue.of(false))
        ]);
        this.requireFullMatch = requireFullMatch;
    }

}