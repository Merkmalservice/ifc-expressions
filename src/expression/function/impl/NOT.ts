import {BooleanValue} from "../../../value/BooleanValue";
import {Func} from "../Func";
import {FuncArgBoolean} from "../arg/FuncArgBoolean";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalSuccessObj} from "../../ExprEvalResult";
import {Type} from "../../../parse/Types";

export class NOT extends Func {
    private static readonly KEY_ARG= "arg";

    constructor() {
        super("NOT", [
            new FuncArgBoolean(true, NOT.KEY_ARG),
        ]);
    }


    getReturnType(): Type {
        return Type.BOOLEAN;
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        const arg = evaluatedArguments.get(NOT.KEY_ARG) as BooleanValue;
        return new ExprEvalSuccessObj(BooleanValue.of(!arg.getValue()));
    }

}