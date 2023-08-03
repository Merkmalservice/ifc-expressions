import {FuncArg} from "../FuncArg";
import {ExprEvalError, ExprEvalResult, ExprEvalTypeErrorObj, isExprEvalSuccess} from "../../ExprEvalResult";
import {ExpressionValue} from "../../../value/ExpressionValue";
import {ArrayValue} from "../../../value/ArrayValue";
import {ExprKind} from "../../ExprKind";

export class FuncArgMappings extends FuncArg<any> {
    constructor(required: boolean, name: string) {
        super(required, name);
    }

    transformValue(
        invocationValue: ExprEvalResult<ExpressionValue>
    ): ExprEvalResult<ExpressionValue> {
        if (isExprEvalSuccess(invocationValue)) {
            const mappings = invocationValue.result as ArrayValue;
            if (!Array.isArray(mappings.getValue())) {
                return FuncArgMappings.makeError(mappings, "The value is not an array");
            }
            const arr =  mappings.getValue();
            if (arr.length === 0){
                return FuncArgMappings.makeError(mappings, "The mappings array is empty");
            }
        }
        return invocationValue;
    }

    public static checkSingleMapping(mappings: Array<ArrayValue>, index: number): ExprEvalError | undefined {
        const element = mappings[index];
        if (!ArrayValue.isArrayValueType(element)) {
            return FuncArgMappings.makeError(element, `The element at 0-based position${index} is not an array: ${JSON.stringify(element)}`);
        }
        const pair = (element as unknown as ArrayValue).getValue();
        if (pair.length !== 2) {
            return FuncArgMappings.makeError(element, `The array at 0-based position ${index} must be of length 2 but is of length ${pair.length}`);
        }
        return undefined;
    }

    private static makeError(mappings: ExpressionValue, problem: string) {
        return new ExprEvalTypeErrorObj(
            ExprKind.FUNCTION_ARGUMENTS,
            `Argument ${this.name} must be an array containing two arrays of the same length (i.e., a 2xn matrix: 2 rows, N columns). Problem: ${problem}.`,
            mappings
        );
    }
}