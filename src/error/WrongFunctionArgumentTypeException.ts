import {ExpressionTypeError} from "./ExpressionTypeError";
import {Type} from "../parse/Types";
import { ParserRuleContext } from "antlr4";

export class WrongFunctionArgumentTypeException extends ExpressionTypeError {
    readonly functionName:string;
    readonly argumentName:string;
    readonly expectedType:Type;
    readonly actualType: Type;
    readonly argumentIndex: number;


    constructor(functionName: string, argumentName: string, expectedType: Type, actualType: Type, argumentIndex: number, ctx: ParserRuleContext) {
        super(`Function ${functionName}: Actual argument type ${actualType} does not satisfy expected type ${expectedType} for argument '${argumentName}' at 0-based position ${argumentIndex}.`, ctx);
        this.functionName = functionName;
        this.argumentName = argumentName;
        this.expectedType = expectedType;
        this.actualType = actualType;
        this.argumentIndex = argumentIndex;
    }

}