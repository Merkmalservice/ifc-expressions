import {Func} from "../Func";
import {FuncArgAny} from "../arg/FuncArgAny";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ExprEvalResult, ExprEvalStatus, ExprEvalSuccessObj, isExprEvalError} from "../../ExprEvalResult";
import {Type} from "../../../parse/Types";
import {BooleanValue} from "../../../value/BooleanValue";
import {FuncArgObjectAccessor} from "../arg/FuncArgObjectAccessor";

export class EXISTS extends Func {

    private  static readonly KEY_OBJECT = "object";

    constructor() {
        super("EXISTS", [new FuncArgObjectAccessor(true, EXISTS.KEY_OBJECT )]);
    }


    getReturnType(): Type {
        return Type.BOOLEAN;
    }

    protected calculateResult(evaluatedArguments: Map<string, ExpressionValue>): ExprEvalResult<ExpressionValue> {
        return undefined; // does not get called
    }



    evaluate(funcArgs: Array<ExprEvalResult<ExpressionValue>>): ExprEvalResult<ExpressionValue> {
        const args = this.getArgumentValues(funcArgs);
        if (isExprEvalError(args)){
            return args;
        }
        const arg = args.get(EXISTS.KEY_OBJECT);
        if (isExprEvalError(arg)){
            if (arg.status === ExprEvalStatus.NOT_FOUND
                || arg.status === ExprEvalStatus.IFC_PROPERTY_NOT_FOUND
                || arg.status === ExprEvalStatus.IFC_TYPE_OBJECT_NOT_FOUND
                || arg.status === ExprEvalStatus.IFC_PROPERTY_SET_NOT_FOUND) {
                return new ExprEvalSuccessObj(BooleanValue.of(false));
            } else {
                return arg
            }
        }
        return new ExprEvalSuccessObj(BooleanValue.of(true));
    }
}