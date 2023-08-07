import {Func} from "../Func";
import {FuncArgAny} from "../arg/FuncArgAny";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalSuccessObj, ExprEvalTypeErrorObj} from "../../ExprEvalResult";
import {isComparable} from "../../../value/Comparable";
import {ExprKind} from "../../ExprKind";
import {BooleanValue} from "../../../value/BooleanValue";

export class CompareMagnitudes extends Func {

    private static readonly KEY_LEFT = "left";
    private static readonly KEY_RIGHT = "right";
    private readonly comparisonFunction: (arg: number) => boolean;

    constructor(name: string, cmp: (arg:number) => boolean) {
        super(name, [
            new FuncArgAny(true, CompareMagnitudes.KEY_LEFT),
            new FuncArgAny(true, CompareMagnitudes.KEY_RIGHT),
        ]);
        this.comparisonFunction = cmp;
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        const left = evaluatedArguments.get(CompareMagnitudes.KEY_LEFT);
        const right = evaluatedArguments.get(CompareMagnitudes.KEY_RIGHT)
        if (!isComparable(left)){
            return new ExprEvalTypeErrorObj(ExprKind.FUNCTION, "Cannot compare: left value is not comparable", left);
        }
        if (!isComparable(right)){
            return new ExprEvalTypeErrorObj(ExprKind.FUNCTION, "Cannot compare: right value is not comparable", right);
        }
        // @ts-ignore
        const cmpValue = this.comparisonFunction(left.compareTo(right));
        return new ExprEvalSuccessObj(BooleanValue.of(cmpValue));
    }


}