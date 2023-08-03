import {BooleanValue} from "../../../value/BooleanValue";
import {Func} from "../Func";
import {FuncArgBoolean} from "../arg/FuncArgBoolean";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalSuccessObj} from "../../ExprEvalResult";

export class FuncBooleanBinary extends Func {
    private static readonly KEY_LEFT= "left";
    private static readonly KEY_RIGHT= "right";
    private readonly actualCalculation: (l:boolean, r:boolean) => boolean;

    constructor(name: string, fun: (l:boolean,r:boolean) => boolean) {
        super(name, [
            new FuncArgBoolean(true, FuncBooleanBinary.KEY_LEFT),
            new FuncArgBoolean(true, FuncBooleanBinary.KEY_RIGHT)
        ]);
        this.actualCalculation = fun;
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        const left = evaluatedArguments.get(FuncBooleanBinary.KEY_LEFT) as BooleanValue;
        const right = evaluatedArguments.get(FuncBooleanBinary.KEY_RIGHT) as BooleanValue;
        return new ExprEvalSuccessObj(BooleanValue.of(this.actualCalculation(left.getValue(),right.getValue())));
    }

}