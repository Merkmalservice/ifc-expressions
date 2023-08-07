import {Func} from "../Func";
import {FuncArgAny} from "../arg/FuncArgAny";
import {Type} from "../../../parse/Types";
import {ExprEvalResult, ExprEvalSuccessObj} from "../../ExprEvalResult";
import {BooleanValue} from "../../../value/BooleanValue";
import {ExpressionValue} from "../../../value/ExpressionValue";

export class EQUALS extends Func {
    protected static readonly KEY_LEFT = "left";
    protected static readonly KEY_RIGHT = "right";

    constructor() {
        super("EQUALS", [new FuncArgAny(true, EQUALS.KEY_LEFT), new FuncArgAny(true, EQUALS.KEY_RIGHT)]);
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        const left = evaluatedArguments.get(EQUALS.KEY_LEFT);
        const right = evaluatedArguments.get(EQUALS.KEY_RIGHT)
        return new ExprEvalSuccessObj(BooleanValue.of(left.equals(right)));
    }

    getReturnType(): Type {
        return Type.BOOLEAN;
    }
}