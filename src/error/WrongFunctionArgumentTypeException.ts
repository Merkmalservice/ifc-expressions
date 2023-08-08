import { ExpressionTypeError } from "./ExpressionTypeError.js";
import { ParserRuleContext } from "antlr4";
import { ExprType } from "../type/ExprType.js";

export class WrongFunctionArgumentTypeException extends ExpressionTypeError {
  readonly functionName: string;
  readonly argumentName: string;
  readonly expectedType: ExprType;
  readonly actualType: ExprType;
  readonly argumentIndex: number;

  constructor(
    functionName: string,
    argumentName: string,
    expectedType: ExprType,
    actualType: ExprType,
    argumentIndex: number,
    ctx: ParserRuleContext
  ) {
    super(
      `Function ${functionName}: Actual argument type '${actualType.getName()}' does not satisfy expected type '${expectedType.getName()}' for argument '${argumentName}' at 0-based position ${argumentIndex}.`,
      ctx
    );
    this.functionName = functionName;
    this.argumentName = argumentName;
    this.expectedType = expectedType;
    this.actualType = actualType;
    this.argumentIndex = argumentIndex;
  }
}
