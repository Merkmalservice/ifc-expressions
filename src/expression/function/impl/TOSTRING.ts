import {Func} from "../Func";
import {FuncArgAny} from "../arg/FuncArgAny";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalSuccessObj} from "../../ExprEvalResult";
import {StringValue} from "../../../value/StringValue";

export class TOSTRING extends Func{

    constructor() {
        super("TOSTRING", [new FuncArgAny(true,"object")]);
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        return new ExprEvalSuccessObj(StringValue.of(evaluatedArguments.get("object").toString()));
    }


}